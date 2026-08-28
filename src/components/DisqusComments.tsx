import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: {
          page: {
            url: string;
            identifier: string;
            title?: string;
          };
        }) => void;
      }) => void;
    };
    disqus_config?: (this: {
      page: {
        url: string;
        identifier: string;
        title?: string;
      };
    }) => void;
  }
}

interface DisqusCommentsProps {
  identifier?: string;
  title?: string;
  url?: string;
  shortname?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  identifier = 'sg-commuter-portal-main',
  title = 'SG Commuter Portal Discussions',
  url,
  shortname = 'zacphoon',
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-qz7hdz6oiqh4j7a7ryxsue-786291031346.asia-east1.run.app');

  useEffect(() => {
    // Configure Disqus parameters
    window.disqus_config = function () {
      this.page.url = canonicalUrl;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    const disqusScriptId = 'disqus-embed-script';
    const existingScript = document.getElementById(disqusScriptId);

    if (window.DISQUS) {
      // If script is already present on page, reset thread with fresh config
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = canonicalUrl;
            this.page.identifier = identifier;
            this.page.title = title;
          },
        });
        setIsLoaded(true);
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else if (!existingScript) {
      // Inject Disqus script
      const script = document.createElement('script');
      script.id = disqusScriptId;
      script.src = `https://${shortname}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', String(+new Date()));
      script.async = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = (e) => {
        console.warn('Disqus embed load error:', e);
        setIsLoaded(true); // show container nonetheless
      };

      (document.head || document.body).appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [identifier, canonicalUrl, title, shortname]);

  return (
    <div className="w-full bg-[#171f33] border border-[#334155] rounded-xl p-5 md:p-6 shadow-md transition-all">
      <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#005baa]/30 border border-[#005baa] flex items-center justify-center text-[#a6c8ff]">
            <span className="material-symbols-outlined text-[22px]">forum</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#dae2fd] tracking-tight flex items-center gap-2">
              Commuter Live Chat & Feedback
              <span className="text-[11px] font-normal px-2 py-0.5 bg-[#005baa]/20 text-[#a6c8ff] rounded border border-[#005baa]/40">
                Disqus Powered
              </span>
            </h3>
            <p className="text-xs text-[#c1c6d3]">
              Share real-time transit alerts, station crowds, or leave commuter tips for fellow travelers.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.DISQUS) {
              window.DISQUS.reset({
                reload: true,
                config: function () {
                  this.page.url = canonicalUrl;
                  this.page.identifier = identifier;
                  this.page.title = title;
                },
              });
            }
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs text-[#a6c8ff] hover:text-white px-3 py-1.5 rounded-lg bg-[#222a3d] border border-[#334155] hover:border-[#a6c8ff] transition-all cursor-pointer"
          title="Reload Comments"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Refresh Thread</span>
        </button>
      </div>

      {/* Disqus Container */}
      <div className="min-h-[220px] relative">
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#c1c6d3]">
            <div className="w-6 h-6 border-2 border-[#005baa] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading Disqus Community Feed...</span>
          </div>
        )}

        <div id="disqus_thread" className="disqus-container bg-white/5 rounded-lg p-3"></div>

        <noscript>
          Please enable JavaScript to view the{' '}
          <a
            href="https://disqus.com/?ref_noscript"
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="text-[#a6c8ff] underline"
          >
            comments powered by Disqus.
          </a>
        </noscript>
      </div>
    </div>
  );
};
