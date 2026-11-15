import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ExternalLink,
  Bookmark,
  Search,
  RefreshCw,
  BookOpen,
  Database,
  Layers,
  FileText,
  X,
  ChevronDown,
  Newspaper,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SurgicalArticle } from '../types';

interface ExtendedArticle extends SurgicalArticle {
  pmid?: string;
  doi?: string;
  fullTextUrl?: string;
}

interface AbstractData {
  pmid: string;
  title: string;
  journal: string;
  abstractSections: { label?: string; text: string }[];
  fullAbstractText: string;
  meshTerms: string[];
  url?: string;
}

const AUTO_REFRESH_SECONDS = 90;

const getInitialBatchSeed = (): number => {
  try {
    const prev = Number(sessionStorage.getItem('surgitrack_news_seed') || '0');
    const next = (prev + 1) % 24;
    sessionStorage.setItem('surgitrack_news_seed', String(next));
    return next;
  } catch {
    return Math.floor(Date.now() / 60000) % 24;
  }
};

export const SurgicalNewsView: React.FC = () => {
  const { toggleSaveArticle, isArticleSaved } = useData();
  const { language } = useAuth();
  const isRTL = language === 'ar';

  const [articles, setArticles] = useState<ExtendedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastSync, setLastSync] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'journals' | 'pubmed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [batchSeed, setBatchSeed] = useState<number>(() => getInitialBatchSeed());
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [secondsUntilNext, setSecondsUntilNext] = useState(AUTO_REFRESH_SECONDS);
  const [sourceTypeLabel, setSourceTypeLabel] = useState<string>('');
  const seedRef = useRef(batchSeed);
  seedRef.current = batchSeed;

  // Abstract modal state
  const [activeAbstractPmid, setActiveAbstractPmid] = useState<string | null>(null);
  const [abstractData, setAbstractData] = useState<AbstractData | null>(null);
  const [loadingAbstract, setLoadingAbstract] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fetchNews = useCallback(
    async (isFresh = false, nextPage = 1, append = false, customSeed?: number) => {
      if (append) {
        setLoadingMore(true);
      } else if (isFresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const activeSeed = customSeed !== undefined ? customSeed : seedRef.current;

      try {
        const url = `/api/news?source=${sourceFilter}&category=${encodeURIComponent(selectedCategory)}&page=${nextPage}&limit=12&seed=${activeSeed}${isFresh ? '&refresh=true' : ''}`;
        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data.articles)) {
          if (append) {
            setArticles(prev => {
              const seen = new Set(prev.map(p => p.id));
              const incoming = data.articles.filter((a: ExtendedArticle) => !seen.has(a.id));
              return [...prev, ...incoming];
            });
          } else {
            setArticles(data.articles);
          }
          setSourceTypeLabel(data.sourceType || 'Live Surgical Literature');
          setPage(nextPage);
          setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setSecondsUntilNext(AUTO_REFRESH_SECONDS);
        }
      } catch (e) {
        console.warn('Failed to load server news feed:', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [sourceFilter, selectedCategory]
  );

  // Trigger fresh batch fetch
  const triggerRotationFetch = useCallback(() => {
    const nextSeed = seedRef.current + 1;
    setBatchSeed(nextSeed);
    seedRef.current = nextSeed;
    try {
      sessionStorage.setItem('surgitrack_news_seed', String(nextSeed));
    } catch {
      /* ignore */
    }
    fetchNews(true, 1, false, nextSeed);
  }, [fetchNews]);

  // Initial fetch on filter change
  useEffect(() => {
    fetchNews(false, 1, false, seedRef.current);
  }, [fetchNews]);

  // Continuous automatic refresh countdown + tab focus refresh
  useEffect(() => {
    if (!autoUpdateEnabled) return;
    const tick = setInterval(() => {
      setSecondsUntilNext(prev => {
        if (prev <= 1) {
          triggerRotationFetch();
          return AUTO_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        triggerRotationFetch();
      }
    };
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [autoUpdateEnabled, triggerRotationFetch]);

  const handleOpenAbstract = async (article: ExtendedArticle) => {
    const pmid = article.pmid || (article.id.startsWith('pubmed-') ? article.id.replace('pubmed-', '') : null);
    if (!pmid) {
      setActiveAbstractPmid(article.id);
      setLoadingAbstract(false);
      setAbstractData({
        pmid: '',
        title: article.title,
        journal: article.publisher,
        abstractSections: [{ label: 'Summary', text: article.summary }],
        fullAbstractText: article.summary,
        meshTerms: [],
        url: article.url,
      });
      return;
    }

    setActiveAbstractPmid(pmid);
    setAbstractData(null);
    setLoadingAbstract(true);

    try {
      const res = await fetch(`/api/pubmed/abstract/${pmid}`);
      if (res.ok) {
        const data = await res.json();
        setAbstractData({ ...data, url: article.url });
      } else {
        setAbstractData({
          pmid,
          title: article.title,
          journal: article.publisher,
          abstractSections: [{ text: article.summary }],
          fullAbstractText: article.summary,
          meshTerms: [],
          url: article.url,
        });
      }
    } catch {
      setAbstractData({
        pmid,
        title: article.title,
        journal: article.publisher,
        abstractSections: [{ text: article.summary }],
        fullAbstractText: article.summary,
        meshTerms: [],
        url: article.url,
      });
    } finally {
      setLoadingAbstract(false);
    }
  };

  const categories = [
    'All',
    'General Surgery',
    'Vascular Surgery',
    'Surgical Oncology',
    'Cardiothoracic Surgery',
    'Surgical Education',
    'Trauma & Emergency',
  ];

  const filtered = articles.filter(a => {
    if (!a) return false;
    const query = (search || '').toLowerCase();
    return (
      !query ||
      (a.title || '').toLowerCase().includes(query) ||
      (a.publisher || '').toLowerCase().includes(query) ||
      (a.summary || '').toLowerCase().includes(query) ||
      (a.pmid && a.pmid.includes(query))
    );
  });

  return (
    <div className="space-y-5">
      {/* Live Auto-Updating Header Strip */}
      <div className="bg-[#101C32] rounded-2xl p-5 sm:p-6 text-white border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-teal-300 tabular-nums">
            <span>PubMed + Europe PMC</span>
            <span aria-hidden="true">·</span>
            <span>{sourceTypeLabel || (isRTL ? 'تدفق بحثي متجدد' : 'Rotating Literature Feed')}</span>
            {lastSync && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">
                  {isRTL ? `آخر تحديث: ${lastSync}` : `Updated: ${lastSync}`}
                </span>
              </>
            )}
            {autoUpdateEnabled && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-300">
                  {isRTL ? `التحديث القادم خلال ${secondsUntilNext}ث` : `Next rotation: ${secondsUntilNext}s`}
                </span>
              </>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Newspaper size={20} className="text-teal-400 shrink-0" />
            <span>{isRTL ? 'أحدث الدراسات والأبحاث الجراحية المتجددة' : 'Auto-Updating Surgical Research Stream'}</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isRTL
              ? 'تتجدد الدراسات تلقائياً مع كل دورة ومن أبرز المجلات المحكمة (BJS، Annals، EJVES، JAMA Surgery، Lancet) وPubMed وEurope PMC لضمان متابعة مستمرة دون تكرار.'
              : 'Automatically rotates and fetches newly published surgical studies from PubMed, Europe PMC, and leading surgical journals so your research feed stays fresh.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setAutoUpdateEnabled(v => !v)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer whitespace-nowrap shrink-0 ${
              autoUpdateEnabled
                ? 'bg-white/10 border-teal-400/40 text-teal-200 hover:bg-white/15'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {autoUpdateEnabled
              ? (isRTL ? 'تحديث تلقائي: مفعّل' : 'Auto-Update: On')
              : (isRTL ? 'تحديث تلقائي: متوقف' : 'Auto-Update: Paused')}
          </button>
          <button
            type="button"
            onClick={triggerRotationFetch}
            disabled={loading || refreshing}
            className="flex items-center gap-2 bg-[#0D9488] hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw size={14} className={loading || refreshing ? 'animate-spin' : ''} />
            <span>{isRTL ? 'تحديث وجلب أبحاث جديدة' : 'Fetch Fresh Studies'}</span>
          </button>
        </div>
      </div>

      {/* Source Filter + Search + Specialty Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setSourceFilter('all')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                sourceFilter === 'all'
                  ? 'bg-[#101C32] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={13} />
              <span>{isRTL ? 'جميع المصادر' : 'All Sources'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('journals')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                sourceFilter === 'journals'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={13} />
              <span>{isRTL ? 'المجلات الجراحية الكبرى' : 'Top Surgical Journals'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('pubmed')}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                sourceFilter === 'pubmed'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database size={13} />
              <span>{isRTL ? 'بث PubMed المباشر' : 'Live PubMed'}</span>
            </button>
          </div>

          <div className="relative w-full lg:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isRTL ? 'تصفية العناوين، المجلات أو PMID...' : 'Filter titles, journals, or PMID...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition cursor-pointer font-semibold ${
                selectedCategory === cat
                  ? 'bg-[#101C32] text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map(article => {
              const saved = isArticleSaved(article.id);
              const isPubMedLinked = Boolean(article.pmid || article.id.startsWith('pubmed-'));

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-teal-400 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      {!failedImages[article.id] && article.imageUrl ? (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          referrerPolicy="no-referrer"
                          onError={() => setFailedImages(prev => ({ ...prev, [article.id]: true }))}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#101C32] to-[#0D9488] text-teal-100 p-6 text-center">
                          <Newspaper size={30} className="mb-1.5 opacity-80" />
                          <span className="text-xs font-semibold">{article.category}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                      <button
                        type="button"
                        onClick={() => toggleSaveArticle(article)}
                        className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition cursor-pointer ${
                          saved
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-900/75 text-slate-200 hover:bg-slate-900 hover:text-white'
                        }`}
                        title={saved ? (isRTL ? 'إزالة من المحفوظة' : 'Remove bookmark') : (isRTL ? 'حفظ في المحفظة' : 'Save study')}
                      >
                        <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                      </button>

                      <div className="absolute bottom-3 inset-x-4 flex items-center justify-between gap-2 text-xs text-white">
                        <span className="font-semibold text-teal-300 truncate">{article.publisher}</span>
                        {article.pmid && (
                          <span className="font-mono text-[11px] text-slate-200 shrink-0 tabular-nums">
                            PMID {article.pmid}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span className="text-teal-700 font-semibold">{article.category}</span>
                        {article.journalImpact && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{article.journalImpact}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-800 transition-colors">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{article.publishedDate}</span>
                      {article.readTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{article.readTime}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPubMedLinked && (
                        <button
                          type="button"
                          onClick={() => handleOpenAbstract(article)}
                          className="inline-flex items-center gap-1 bg-slate-50 hover:bg-teal-50 text-teal-800 border border-slate-200 hover:border-teal-300 font-semibold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <FileText size={12} />
                          <span>{isRTL ? 'الملخص' : 'Abstract'}</span>
                        </button>
                      )}
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#101C32] hover:bg-[#0D9488] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>{isRTL ? 'قراءة الدراسة' : 'Read Study'}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => fetchNews(false, page + 1, true)}
              disabled={loadingMore}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {loadingMore ? (
                <RefreshCw size={14} className="animate-spin text-teal-600" />
              ) : (
                <ChevronDown size={14} className="text-teal-600" />
              )}
              <span>{isRTL ? 'تحميل المزيد من الدراسات المتجددة' : 'Load More Surgical Studies'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-xs space-y-2">
          <BookOpen size={28} className="mx-auto text-slate-400" />
          <p className="font-semibold text-slate-800">
            {isRTL ? 'لا توجد دراسات تطابق البحث الحالي.' : 'No surgical articles match your search or filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSourceFilter('all');
              triggerRotationFetch();
            }}
            className="text-teal-700 font-bold underline cursor-pointer"
          >
            {isRTL ? 'إعادة الضبط وجلب أبحاث جديدة' : 'Reset filters and fetch studies'}
          </button>
        </div>
      )}

      {/* Abstract Modal */}
      {activeAbstractPmid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                <span className="font-bold text-teal-800">
                  {abstractData?.pmid || /^\d+$/.test(activeAbstractPmid)
                    ? `PMID ${abstractData?.pmid || activeAbstractPmid}`
                    : 'Journal Article'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[280px] font-sans font-semibold">
                  {abstractData?.journal || 'NCBI PubMed'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveAbstractPmid(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingAbstract ? (
                <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                  <RefreshCw size={22} className="animate-spin mx-auto text-teal-600" />
                  <p>{isRTL ? 'جارٍ استرجاع ملخص البحث...' : 'Fetching structured abstract...'}</p>
                </div>
              ) : abstractData ? (
                <>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {abstractData.title}
                  </h3>
                  {abstractData.abstractSections.length > 0 ? (
                    <div className="space-y-3">
                      {abstractData.abstractSections.map((sec, idx) => (
                        <div key={idx} className="text-xs leading-relaxed">
                          {sec.label && (
                            <span className="font-bold text-teal-800 uppercase tracking-wide block mb-0.5">
                              {sec.label}
                            </span>
                          )}
                          <p className="text-slate-700 whitespace-pre-line">{sec.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {abstractData.fullAbstractText || 'No structured abstract available.'}
                    </p>
                  )}

                  {abstractData.meshTerms && abstractData.meshTerms.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">MeSH Terms</span>
                      <p className="text-xs text-slate-600">
                        {abstractData.meshTerms.join(' · ')}
                      </p>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              {abstractData?.url && (
                <a
                  href={abstractData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <span>{isRTL ? 'فتح المصدر الرسمي' : 'Open Official Article'}</span>
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                type="button"
                onClick={() => setActiveAbstractPmid(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
