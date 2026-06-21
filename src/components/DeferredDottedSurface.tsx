import { lazy, Suspense, useEffect, useState } from "react";

const EmptyDottedSurface = () => null;

const DottedSurface = lazy(() =>
  import("@/components/ui/dotted-surface")
    .then((module) => ({
      default: module.DottedSurface,
    }))
    .catch(() => ({
      default: EmptyDottedSurface,
    })),
);

const scheduleIdle = (callback: IdleRequestCallback): number => {
  if (window.requestIdleCallback) return window.requestIdleCallback(callback);

  return window.setTimeout(
    () => callback({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline),
    1200,
  );
};

const cancelIdle = (id: number) => {
  if (window.cancelIdleCallback) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};

const DeferredDottedSurface = () => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let idleId: number | null = null;

    const canRender = () => desktopQuery.matches && !motionQuery.matches;

    const clearIdle = () => {
      if (idleId !== null) {
        cancelIdle(idleId);
        idleId = null;
      }
    };

    const syncRenderState = () => {
      clearIdle();

      if (!canRender()) {
        setShouldRender(false);
        return;
      }

      idleId = scheduleIdle(() => {
        idleId = null;
        if (canRender()) setShouldRender(true);
      });
    };

    syncRenderState();

    desktopQuery.addEventListener("change", syncRenderState);
    motionQuery.addEventListener("change", syncRenderState);

    return () => {
      clearIdle();
      desktopQuery.removeEventListener("change", syncRenderState);
      motionQuery.removeEventListener("change", syncRenderState);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <Suspense fallback={null}>
      <DottedSurface />
    </Suspense>
  );
};

export default DeferredDottedSurface;
