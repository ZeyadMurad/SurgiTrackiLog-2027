/**
 * Utilities for client-side image compression and Firestore payload size checking.
 * Keeps embedded base64 photos safely well below Firestore's 1 MiB document limit.
 */

export interface ImageCompressionOptions {
  maxDimension?: number;
  quality?: number;
  maxOutputBytes?: number;
}

export function estimateJsonByteSize(data: unknown): number {
  try {
    const json = JSON.stringify(data);
    return new Blob([json]).size;
  } catch {
    return 0;
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

export async function compressImageFileToDataUrl(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<string> {
  const {
    maxDimension = 1024,
    quality = 0.78,
    maxOutputBytes = 220_000,
  } = options;

  const rawDataUrl = await fileToDataUrl(file);
  if (!file.type.startsWith('image/')) {
    return rawDataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          resolve(rawDataUrl);
          return;
        }

        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let currentQuality = quality;
        let result = canvas.toDataURL('image/jpeg', currentQuality);

        // Iteratively step down quality if still above byte budget
        while (result.length > maxOutputBytes * 1.37 && currentQuality > 0.42) {
          currentQuality = Math.max(0.4, currentQuality - 0.12);
          result = canvas.toDataURL('image/jpeg', currentQuality);
        }

        // If raw original was already smaller than re-encoded JPEG (e.g., tiny PNG), keep smaller
        resolve(result.length < rawDataUrl.length ? result : rawDataUrl);
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}
