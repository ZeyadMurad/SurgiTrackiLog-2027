import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_KEYS = [
  'TIGRIS_ENDPOINT',
  'TIGRIS_ACCESS_KEY',
  'TIGRIS_SECRET_KEY',
  'TIGRIS_BUCKET',
] as const;

export type TigrisEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

export interface TigrisObjectSummary {
  key: string;
  size: number;
  lastModified: string | null;
}

export interface TigrisConnectionTestResult {
  envPresent: Record<TigrisEnvKey, boolean>;
  allEnvPresent: boolean;
  connected: boolean;
  prefix: string;
  maxKeys: number;
  objectCount: number;
  isTruncated: boolean;
  objects: TigrisObjectSummary[];
  errorCode: string | null;
  errorReason: string | null;
  checkedAt: string;
}

export interface TigrisPrefixListing {
  prefix: string;
  commonPrefixes: string[];
  objects: TigrisObjectSummary[];
  isTruncated: boolean;
  nextContinuationToken: string | null;
}

const DEFAULT_PREFIX = 'BodyParts3D_4.3/';
const MAX_LIST_KEYS = 10;
const ALLOWED_ASSET_EXTENSIONS = new Set(['.obj', '.mtl', '.glb', '.gltf', '.csv', '.txt', '.json', '.md']);

function isPrivateOrLoopbackHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '[::1]' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }
  if (/^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
    return true;
  }
  const m172 = host.match(/^172\.(\d{1,3})\./);
  if (m172) {
    const second = Number(m172[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

function scrubSecrets(message: string, secretValues: Array<string | undefined>): string {
  let clean = message || 'Unknown error';
  for (const raw of secretValues) {
    const val = raw?.trim();
    if (val && val.length >= 3) {
      clean = clean.split(val).join('[REDACTED]');
    }
  }
  return clean;
}

export function checkTigrisEnvPresence(): {
  envPresent: Record<TigrisEnvKey, boolean>;
  allEnvPresent: boolean;
} {
  const envPresent = {
    TIGRIS_ENDPOINT: Boolean(process.env.TIGRIS_ENDPOINT?.trim()),
    TIGRIS_ACCESS_KEY: Boolean(process.env.TIGRIS_ACCESS_KEY?.trim()),
    TIGRIS_SECRET_KEY: Boolean(process.env.TIGRIS_SECRET_KEY?.trim()),
    TIGRIS_BUCKET: Boolean(process.env.TIGRIS_BUCKET?.trim()),
  };
  const allEnvPresent = REQUIRED_ENV_KEYS.every((k) => envPresent[k]);
  return { envPresent, allEnvPresent };
}

function createVerifiedS3Client(): {
  client: S3Client;
  bucket: string;
  secrets: Array<string | undefined>;
} {
  const endpointRaw = process.env.TIGRIS_ENDPOINT?.trim();
  const accessKeyId = process.env.TIGRIS_ACCESS_KEY?.trim();
  const secretAccessKey = process.env.TIGRIS_SECRET_KEY?.trim();
  const bucket = process.env.TIGRIS_BUCKET?.trim();

  if (!endpointRaw || !accessKeyId || !secretAccessKey || !bucket) {
    throw Object.assign(new Error('Missing required Tigris environment variables.'), {
      code: 'MISSING_ENV_VARIABLES',
    });
  }

  let parsedEndpoint: URL;
  try {
    parsedEndpoint = new URL(endpointRaw);
  } catch {
    throw Object.assign(new Error('TIGRIS_ENDPOINT is not a valid URL.'), {
      code: 'INVALID_ENDPOINT_URL',
    });
  }

  if (parsedEndpoint.protocol !== 'https:' || isPrivateOrLoopbackHost(parsedEndpoint.hostname)) {
    throw Object.assign(new Error('TIGRIS_ENDPOINT must use HTTPS and point to an external storage endpoint.'), {
      code: 'DISALLOWED_ENDPOINT',
    });
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: parsedEndpoint.origin,
    credentials: { accessKeyId, secretAccessKey },
  });

  return {
    client,
    bucket,
    secrets: [endpointRaw, accessKeyId, secretAccessKey, bucket],
  };
}

export function validateBodyPartsKey(rawKey: string): string | null {
  const key = (rawKey || '').trim().replace(/^\/+/, '');
  if (!key.startsWith(DEFAULT_PREFIX)) return null;
  if (key.includes('..') || key.includes('\\') || key.includes('\0')) return null;
  const dotIdx = key.lastIndexOf('.');
  if (dotIdx === -1) return null;
  const ext = key.slice(dotIdx).toLowerCase();
  if (!ALLOWED_ASSET_EXTENSIONS.has(ext)) return null;
  return key;
}

export async function listTigrisPrefix(
  prefix: string = DEFAULT_PREFIX,
  maxKeys: number = 100,
  delimiter?: string,
  continuationToken?: string,
): Promise<TigrisPrefixListing> {
  const safePrefix = prefix.startsWith(DEFAULT_PREFIX) && !prefix.includes('..') ? prefix : DEFAULT_PREFIX;
  const cappedMaxKeys = Math.min(Math.max(1, maxKeys), 1000);
  const { client, bucket } = createVerifiedS3Client();

  try {
    const resp = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: safePrefix,
        MaxKeys: cappedMaxKeys,
        ...(delimiter ? { Delimiter: delimiter } : {}),
        ...(continuationToken ? { ContinuationToken: continuationToken } : {}),
      }),
      { abortSignal: AbortSignal.timeout(15_000) },
    );

    return {
      prefix: safePrefix,
      commonPrefixes: (resp.CommonPrefixes || []).map((p) => p.Prefix || '').filter(Boolean),
      objects: (resp.Contents || []).map((item) => ({
        key: item.Key || '',
        size: typeof item.Size === 'number' ? item.Size : 0,
        lastModified: item.LastModified ? item.LastModified.toISOString() : null,
      })),
      isTruncated: Boolean(resp.IsTruncated),
      nextContinuationToken: resp.NextContinuationToken || null,
    };
  } finally {
    client.destroy();
  }
}

export async function getTigrisTextObject(key: string, maxBytes: number = 2 * 1024 * 1024): Promise<string> {
  const safeKey = validateBodyPartsKey(key);
  if (!safeKey) {
    throw Object.assign(new Error('Invalid BodyParts3D asset key.'), { code: 'INVALID_ASSET_KEY' });
  }
  const { client, bucket, secrets } = createVerifiedS3Client();
  try {
    const resp = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: safeKey }),
      { abortSignal: AbortSignal.timeout(20_000) },
    );
    const bytes = await resp.Body?.transformToByteArray();
    if (!bytes) return '';
    const slice = bytes.byteLength > maxBytes ? bytes.subarray(0, maxBytes) : bytes;
    return new TextDecoder('utf-8').decode(slice);
  } catch (err: any) {
    throw new Error(scrubSecrets(err?.message || 'Failed to read Tigris text object.', secrets));
  } finally {
    client.destroy();
  }
}

export async function getTigrisAssetBuffer(key: string): Promise<{
  buffer: Buffer;
  contentType: string;
  contentLength: number;
}> {
  const safeKey = validateBodyPartsKey(key);
  if (!safeKey) {
    throw Object.assign(new Error('Invalid BodyParts3D asset key.'), { code: 'INVALID_ASSET_KEY' });
  }
  const { client, bucket, secrets } = createVerifiedS3Client();
  try {
    const resp = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: safeKey }),
      { abortSignal: AbortSignal.timeout(25_000) },
    );
    const bytes = await resp.Body?.transformToByteArray();
    if (!bytes) {
      throw Object.assign(new Error('Empty asset response from storage.'), { code: 'EMPTY_OBJECT' });
    }
    const ext = safeKey.slice(safeKey.lastIndexOf('.')).toLowerCase();
    const contentType =
      ext === '.glb'
        ? 'model/gltf-binary'
        : ext === '.gltf'
        ? 'model/gltf+json'
        : ext === '.json'
        ? 'application/json; charset=utf-8'
        : 'text/plain; charset=utf-8';
    const buf = Buffer.from(bytes);
    return {
      buffer: buf,
      contentType,
      contentLength: buf.byteLength,
    };
  } catch (err: any) {
    const errMsg = scrubSecrets(err?.message || 'Failed to fetch Tigris asset.', secrets);
    throw Object.assign(new Error(errMsg), {
      code: err?.Code || err?.name || 'S3_FETCH_ERROR',
      status: err?.$metadata?.httpStatusCode || 502,
    });
  } finally {
    client.destroy();
  }
}

export async function testTigrisConnection(
  prefix: string = DEFAULT_PREFIX,
): Promise<TigrisConnectionTestResult> {
  const checkedAt = new Date().toISOString();
  const { envPresent, allEnvPresent } = checkTigrisEnvPresence();

  const endpointRaw = process.env.TIGRIS_ENDPOINT?.trim();
  const accessKeyId = process.env.TIGRIS_ACCESS_KEY?.trim();
  const secretAccessKey = process.env.TIGRIS_SECRET_KEY?.trim();
  const bucket = process.env.TIGRIS_BUCKET?.trim();

  if (!allEnvPresent || !endpointRaw || !accessKeyId || !secretAccessKey || !bucket) {
    const missing = REQUIRED_ENV_KEYS.filter((k) => !envPresent[k]);
    return {
      envPresent,
      allEnvPresent: false,
      connected: false,
      prefix,
      maxKeys: MAX_LIST_KEYS,
      objectCount: 0,
      isTruncated: false,
      objects: [],
      errorCode: 'MISSING_ENV_VARIABLES',
      errorReason: `Missing required server environment variables: ${missing.join(', ')}`,
      checkedAt,
    };
  }

  let client: S3Client;
  let secrets: Array<string | undefined>;
  try {
    const verified = createVerifiedS3Client();
    client = verified.client;
    secrets = verified.secrets;
  } catch (err: any) {
    return {
      envPresent,
      allEnvPresent: true,
      connected: false,
      prefix,
      maxKeys: MAX_LIST_KEYS,
      objectCount: 0,
      isTruncated: false,
      objects: [],
      errorCode: err?.code || 'INVALID_CONFIGURATION',
      errorReason: err?.message || 'Invalid Tigris configuration.',
      checkedAt,
    };
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: MAX_LIST_KEYS,
    });

    const response = await client.send(command, {
      abortSignal: AbortSignal.timeout(12_000),
    });

    const objects: TigrisObjectSummary[] = (response.Contents || []).map((item) => ({
      key: item.Key || '',
      size: typeof item.Size === 'number' ? item.Size : 0,
      lastModified: item.LastModified ? item.LastModified.toISOString() : null,
    }));

    return {
      envPresent,
      allEnvPresent: true,
      connected: true,
      prefix,
      maxKeys: MAX_LIST_KEYS,
      objectCount: objects.length,
      isTruncated: Boolean(response.IsTruncated),
      objects,
      errorCode: null,
      errorReason: null,
      checkedAt,
    };
  } catch (err: any) {
    const httpStatus = err?.$metadata?.httpStatusCode;
    const rawCode = err?.Code || err?.name || 'S3_CONNECTION_ERROR';
    const errorCode = httpStatus ? `${rawCode} (HTTP ${httpStatus})` : String(rawCode);
    const errorReason = scrubSecrets(err?.message || 'Failed to list objects from Tigris S3.', secrets);

    return {
      envPresent,
      allEnvPresent: true,
      connected: false,
      prefix,
      maxKeys: MAX_LIST_KEYS,
      objectCount: 0,
      isTruncated: false,
      objects: [],
      errorCode,
      errorReason,
      checkedAt,
    };
  } finally {
    client.destroy();
  }
}
