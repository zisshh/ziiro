import { useEffect, useRef } from 'react';

export function UnicornBackground() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const styleRef  = useRef<HTMLStyleElement  | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load UnicornStudio runtime
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head||document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);
    scriptRef.current = embedScript;

    // Crop bottom 10% to hide any watermark area
    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] { position:relative !important; overflow:hidden !important; }
      [data-us-project] canvas { clip-path: inset(0 0 10% 0) !important; }
      [data-us-project] * { pointer-events:none !important; }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display:none !important; visibility:hidden !important;
        opacity:0 !important; position:absolute !important;
        left:-9999px !important; top:-9999px !important;
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    const hideBranding = () => {
      const el = document.querySelector('[data-us-project]');
      if (!el) return;
      el.querySelectorAll('*').forEach(node => {
        const t = (node.textContent || '').toLowerCase();
        if (t.includes('made with') || t.includes('unicorn')) node.remove();
      });
    };

    hideBranding();
    intervalRef.current = setInterval(hideBranding, 100);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (scriptRef.current && document.head.contains(scriptRef.current))
        document.head.removeChild(scriptRef.current);
      if (styleRef.current && document.head.contains(styleRef.current))
        document.head.removeChild(styleRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-[1]">
      {/* Vitruvian animation — desktop only */}
      <div className="absolute inset-0 hidden lg:block">
        <div
          data-us-project="whwOGlfJ5Rz2rHaEUgHl"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Mobile fallback: subtle star field */}
      <div className="absolute inset-0 lg:hidden unicorn-stars" />
    </div>
  );
}
