import { useState, useEffect, useCallback, useRef } from "react";
import type { RefreshSection, RefreshState, SupportedLanguage } from "../types/newTypes";

export interface UseAppRefreshOptions {
  onRefresh: (sections?: RefreshSection[]) => Promise<void> | void;
  minAutoInterval?: number;
  refreshOnFocus?: boolean;
  refreshOnVisibility?: boolean;
  refreshOnReconnect?: boolean;
  refreshOnMount?: boolean;
}

export function useAppRefresh({
  onRefresh,
  minAutoInterval = 60_000,
  refreshOnFocus = true,
  refreshOnVisibility = true,
  refreshOnReconnect = true,
  refreshOnMount = true,
}: UseAppRefreshOptions) {
  const [refreshState, setRefreshState] = useState<RefreshState>({
    isRefreshing: false,
    lastRefreshAt: new Date().toISOString(),
    error: null,
  });

  const lastRefreshMsRef = useRef<number>(Date.now());
  const inFlightRef = useRef<boolean>(false);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  const refreshNow = useCallback(async (sections?: RefreshSection[]) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setRefreshState(prev => ({ ...prev, isRefreshing: true, error: null }));
    try {
      await onRefreshRef.current(sections);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("surgitrack:refresh", {
            detail: {
              sections: sections || ["news", "research", "community", "cases", "threads", "stories"],
              timestamp: new Date().toISOString(),
            },
          })
        );
      }
      const nowIso = new Date().toISOString();
      lastRefreshMsRef.current = Date.now();
      setRefreshState({
        isRefreshing: false,
        lastRefreshAt: nowIso,
        error: null,
      });
    } catch (err: any) {
      setRefreshState(prev => ({
        ...prev,
        isRefreshing: false,
        error: err?.message || "Refresh failed",
      }));
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const maybeAutoRefresh = useCallback(() => {
    const elapsed = Date.now() - lastRefreshMsRef.current;
    if (elapsed >= minAutoInterval) {
      void refreshNow();
    }
  }, [minAutoInterval, refreshNow]);

  // Mount initial trigger
  useEffect(() => {
    if (!refreshOnMount) return;
    void refreshNow();
  }, [refreshOnMount, refreshNow]);

  // Window focus + visibility change
  useEffect(() => {
    const handleFocus = () => {
      if (refreshOnFocus) maybeAutoRefresh();
    };
    const handleVisibility = () => {
      if (refreshOnVisibility && document.visibilityState === "visible") {
        maybeAutoRefresh();
      }
    };
    const handleOnline = () => {
      if (refreshOnReconnect) {
        void refreshNow();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", handleOnline);
    };
  }, [refreshOnFocus, refreshOnVisibility, refreshOnReconnect, maybeAutoRefresh, refreshNow]);

  // Mobile pull-to-refresh (>150px pull from top of page)
  useEffect(() => {
    let startY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 2 && e.touches.length === 1) {
        startY = e.touches[0].clientY;
      } else {
        startY = null;
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startY === null || e.changedTouches.length === 0) return;
      const deltaY = e.changedTouches[0].clientY - startY;
      startY = null;
      if (deltaY > 150 && window.scrollY <= 2) {
        void refreshNow();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [refreshNow]);

  return {
    refreshState,
    refreshNow,
    isRefreshing: refreshState.isRefreshing,
  };
}

export function timeSinceLastRefresh(
  lastRefreshAt: string | null,
  language: SupportedLanguage = "en"
): string {
  if (!lastRefreshAt) {
    return language === "ar" ? "لم يتحدث" : language === "de" ? "Nie" : "Never";
  }
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(lastRefreshAt).getTime()) / 1000));
  if (diffSec < 45) {
    return language === "ar" ? "الآن" : language === "de" ? "Gerade eben" : "Just now";
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return language === "ar"
      ? `منذ ${diffMin} د`
      : language === "de"
      ? `vor ${diffMin} Min.`
      : `${diffMin} min ago`;
  }
  const diffHr = Math.floor(diffMin / 60);
  return language === "ar"
    ? `منذ ${diffHr} س`
    : language === "de"
    ? `vor ${diffHr} Std.`
    : `${diffHr} hr ago`;
}
