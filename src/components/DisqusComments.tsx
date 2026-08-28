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
  const [loadFailed, setLoadFailed] = useState<boolean>(false);

  // Safe canonical URL
  const canonicalUrl = url || 'https://sg-commuter-portal.vercel.app/community';

  useEffect(() => {
    try {
      window.disqus_config = function () {
        this.page.url = canonicalUrl;
        this.page.identifier = identifier;
        this.page.title = title;
      };

      const disqusScriptId = 'disqus-embed-script';
      const existingScript = document.getElementById(disqusScriptId);

      if (window.DISQUS) {
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
        } catch {
          setIsLoaded(true);
        }
      } else if (!existingScript) {
        const script = document.createElement('script');
        script.id = disqusScriptId;
        script.src = `https://${shortname}.disqus.com/embed.js`;
        script.setAttribute('data-timestamp', String(+new Date()));
        script.async = true;
        script.onload = () => {
          setIsLoaded(true);
        };
        script.onerror = () => {
          setLoadFailed(true);
          setIsLoaded(true);
        };

        (document.head || document.body).appendChild(script);
      } else {
        setIsLoaded(true);
      }
    } catch {
      setLoadFailed(true);
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

        <div className="flex items-center gap-2">
          <a
            href={`https://${shortname}.disqus.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#a6c8ff] hover:text-white px-3 py-1.5 rounded-lg bg-[#222a3d] border border-[#334155] hover:border-[#a6c8ff] transition-all"
            title="Open Disqus Channel in New Tab"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden sm:inline">Disqus Hub</span>
          </a>

          <button
            onClick={() => {
              if (window.DISQUS) {
                try {
                  window.DISQUS.reset({
                    reload: true,
                    config: function () {
                      this.page.url = canonicalUrl;
                      this.page.identifier = identifier;
                      this.page.title = title;
                    },
                  });
                } catch {
                  // Ignore
                }
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#a6c8ff] hover:text-white px-3 py-1.5 rounded-lg bg-[#222a3d] border border-[#334155] hover:border-[#a6c8ff] transition-all cursor-pointer"
            title="Reload Comments"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Disqus Container */}
      <div className="min-h-[220px] relative">
        {!isLoaded && (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#c1c6d3]">
            <div className="w-6 h-6 border-2 border-[#005baa] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading Disqus Community Feed...</span>
          </div>
        )}

        {loadFailed && (
          <div className="p-4 mb-4 rounded-lg bg-[#222a3d] border border-[#334155] text-xs text-[#c1c6d3] flex items-center justify-between">
            <span>Third-party cookies or tracker blocker detected. You can open the discussions directly in Disqus:</span>
            <a
              href={`https://${shortname}.disqus.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a6c8ff] underline font-medium ml-2"
            >
              Open zacphoon.disqus.com →
            </a>
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
