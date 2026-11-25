import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { RiskDisclaimer } from '../components/ui/RiskDisclaimer';
import { EXTENDED_BLOG_POSTS } from '../data/extendedData';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const [readProgress, setReadProgress] = useState(0);

  const post =
    EXTENDED_BLOG_POSTS.find((p) => p.slug === slug) || EXTENDED_BLOG_POSTS[0];
  const related = EXTENDED_BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  return (
    <div className="pt-28 pb-24 bg-[#000000]">
      {/* Reading Progress Hairline */}
      <div
        aria-hidden="true"
        className="fixed top-16 left-0 right-0 z-30 h-[2px] bg-[#141414] pointer-events-none"
      >
        <div
          className="h-full bg-gold-gradient origin-left"
          style={{ transform: `scaleX(${readProgress})` }}
        />
      </div>

      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#9A968C] hover:text-[#F0D58A] mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Research Notes
        </Link>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
          {post.category} · {post.date} · {post.readTime}
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-5xl font-bold text-[#EDE6D6] leading-[1.08]">
          {post.title}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-[#9A968C] leading-relaxed">
          {post.excerpt}
        </p>

        <div className="my-10 border-t border-[#C9A24B]/22" />

        <div className="space-y-9">
          {post.sections.map((sec) => (
            <section key={sec.heading}>
              <h2 className="font-display text-2xl font-bold text-[#EDE6D6] mb-3">
                {sec.heading}
              </h2>
              <p className="text-sm sm:text-base text-[#EDE6D6]/85 leading-relaxed">
                {sec.body}
              </p>
            </section>
          ))}
        </div>

        <RiskDisclaimer compact className="my-12" />

        <div className="pt-8 border-t border-[#C9A24B]/22">
          <h3 className="font-display text-xl font-bold text-[#EDE6D6] mb-5">
            Related Research Notes
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((rel) => (
              <Link key={rel.slug} to={`/blog/${rel.slug}`} className="group block">
                <Card hoverLift className="h-full p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#9A968C]">
                    {rel.category} · {rel.readTime}
                  </p>
                  <h4 className="mt-2 font-display text-base font-bold text-[#EDE6D6] group-hover:text-[#F0D58A]">
                    {rel.title}
                  </h4>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[#F0D58A]">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
