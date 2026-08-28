import React, { useState, useEffect } from 'react';
import { DiscussionEmbed } from 'disqus-react';

export interface ArticleConfig {
  id?: string;
  url?: string;
  title?: string;
}

export interface DisqusCommentsProps {
  article?: ArticleConfig;
  identifier?: string;
  title?: string;
  url?: string;
  shortname?: string;
  language?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  article,
  identifier,
  title,
  url,
  shortname = 'day-2-project-1',
  language = 'zh_TW',
}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  // Determine effective ID, Title, and URL from either `article` prop or individual props
  const effectiveIdentifier = article?.id || identifier || 'sg-commuter-portal-discussions';
  const effectiveTitle = article?.title || title || 'SG Commuter Portal Discussions';

  // Compute canonical URL safely for Vercel deployment preview domains and custom domains
  const getCanonicalUrl = (): string => {
    if (article?.url) return article.url;
    if (url) return url;
    if (typeof window !== 'undefined') {
      try {
        const origin = window.location.origin;
        const pathname = window.location.pathname;
        return `${origin}${pathname}`.replace(/\/+$/, '') || `${origin}/community`;
      } catch {
        return `https://${shortname}.disqus.com`;
      }
    }
    return `https://${shortname}.disqus.com`;
  };

  const canonicalUrl = getCanonicalUrl();

  // Ensure DOM is ready and window is accessible before rendering disqus-react (SSR / Vercel safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  const disqusConfig = {
    url: canonicalUrl,
    identifier: effectiveIdentifier,
    title: effectiveTitle,
    language: language,
  };

  return (
    <div
      id="disqus-container-card"
      className="w-full bg-[#171f33] border border-[#334155] rounded-2xl p-5 md:p-6 shadow-xl transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#334155] pb-4 mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#005baa]/25 border border-[#005baa]/50 flex items-center justify-center text-[#a6c8ff]">
            <span className="material-symbols-outlined text-[24px]">forum</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-[#dae2fd] tracking-tight">
                Commuter Community Forum
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#005baa]/20 text-[#a6c8ff] rounded-md border border-[#005baa]/40">
                Disqus: {shortname}
              </span>
            </div>
            <p className="text-xs text-[#c1c6d3] mt-0.5">
              Live transit updates, delay alerts, and daily commuter discussions powered by Disqus.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <a
            href={`https://${shortname}.disqus.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#a6c8ff] hover:text-white px-3 py-1.5 rounded-lg bg-[#222a3d] border border-[#334155] hover:border-[#a6c8ff] transition-all"
            title="Open Discussions Directly on Disqus Hub"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Open in Disqus</span>
          </a>
        </div>
      </div>

      {/* Embed Container Area with DiscussionEmbed */}
      <div className="min-h-[260px] relative">
        {mounted ? (
          <div className="disqus-react-wrapper bg-white/5 rounded-xl p-3 md:p-4 min-h-[180px]">
            <DiscussionEmbed
              key={`${shortname}-${effectiveIdentifier}`}
              shortname={shortname}
              config={disqusConfig}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#c1c6d3]">
            <div className="w-7 h-7 border-2 border-[#005baa] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Connecting to Disqus DiscussionEmbed ({shortname})...</span>
          </div>
        )}

        <noscript>
          <div className="p-4 rounded-xl bg-[#222a3d] text-xs text-[#c1c6d3] text-center mt-3">
            Please enable JavaScript to view the{' '}
            <a
              href={`https://${shortname}.disqus.com/?ref_noscript`}
              rel="nofollow noopener noreferrer"
              target="_blank"
              className="text-[#a6c8ff] underline"
            >
              comments powered by Disqus.
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};
