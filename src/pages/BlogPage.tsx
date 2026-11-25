import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { SafeImage } from '../components/ui/SafeImage';
import { ShieldFrame } from '../components/ui/TitanMotifs';
import { ACADEMY_ASSETS } from '../data/academyData';
import { EXTENDED_BLOG_POSTS } from '../data/extendedData';

export const BlogPage: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const featured = EXTENDED_BLOG_POSTS.find((p) => p.featured) || EXTENDED_BLOG_POSTS[0];

  const filtered = EXTENDED_BLOG_POSTS.filter((p) => {
    const matchCategory = filter === 'All' || p.category === filter;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  return (
    <div className="pt-20 bg-[#000000]">
      <Section
        romanIndex="01"
        kicker="Research & Desk Notes"
        title="Market Structure Essays & Risk Analysis"
        subtitle="Long-form educational articles covering Forex liquidity, synthetic indices volatility, and position-sizing math."
      >
        {/* Featured Editorial Spread */}
        <Link to={`/blog/${featured.slug}`} className="block mb-14 group">
          <div className="grid gap-10 lg:grid-cols-12 items-center border-y border-[#C9A24B]/24 py-8">
            <div className="lg:col-span-5">
              <ShieldFrame variant="landscape" bright innerClassName="aspect-[16/10] w-full">
                <SafeImage
                  src={ACADEMY_ASSETS.courseLiquidity}
                  alt={featured.title}
                  width={1000}
                  height={560}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </ShieldFrame>
            </div>
            <div className="lg:col-span-7 space-y-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-gold-gradient">
                Featured Essay · {featured.category} · {featured.date} · {featured.readTime}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDE6D6] group-hover:text-[#F0D58A] transition-colors leading-tight">
                {featured.title}
              </h2>
              <p className="max-w-3xl text-sm sm:text-base text-[#9A968C] leading-relaxed">
                {featured.excerpt}
              </p>
              <span className="pt-2 inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#F0D58A]">
                Read Full Monograph
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <Tabs
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'All', label: 'All Topics' },
              { value: 'Market Structure', label: 'Market Structure' },
              { value: 'Risk Management', label: 'Risk Management' },
              { value: 'FX & Synthetics', label: 'FX & Synthetics' },
              { value: 'Trading Psychology', label: 'Psychology' },
            ]}
          />

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#9A968C]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search research notes..."
              aria-label="Search research notes"
              className="h-10 w-full rounded-md border border-[#C9A24B]/24 bg-[#0B0B0C] pl-10 pr-3.5 text-xs text-[#EDE6D6] placeholder:text-[#9A968C]/70 focus:border-[#F0D58A] focus:outline-none"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="text-center py-10">
            <p className="text-sm text-[#9A968C]">
              No research notes matched &ldquo;{query}&rdquo;. Try another keyword.
            </p>
          </Card>
        ) : (
          <div className="border-y border-[#C9A24B]/22 divide-y divide-[#C9A24B]/16">
            {filtered.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group py-7 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#0B0B0C]/75 px-3 -mx-3 transition-colors"
              >
                <div className="max-w-3xl">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A24B]">
                    {post.category} · {post.date} · {post.readTime}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl font-bold text-[#EDE6D6] group-hover:text-[#F0D58A] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#9A968C] leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 shrink-0 font-mono text-xs font-semibold text-[#F0D58A]">
                  Read Essay
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default BlogPage;
