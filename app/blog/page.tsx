export const dynamic = "force-static";
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BreadcrumbSchema from "../components/BreadcrumbSchema";

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  excerpt?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/blog")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  const filtered = selectedTag
    ? posts.filter((p) => p.tags?.includes(selectedTag))
    : posts;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <BreadcrumbSchema name="Blog" path="/blog" />
      <div className="pt-48 pb-28 px-6">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={fade}
          >
            <p className="text-[12px] text-[#555] tracking-[0.2em] uppercase mb-5 font-mono">
              [ Blog ]
            </p>
            <h1 className="heading-xl mb-4">
              Insights on AI visibility
            </h1>
            <p className="body-lg max-w-[560px] mx-auto">
              GEO optimization, how AI engines pick brands, and what you can do about it.
            </p>
          </motion.div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mb-10 justify-center"
              initial="hidden"
              animate="visible"
              variants={fade}
            >
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                  !selectedTag
                    ? "border-white text-white"
                    : "border-[#333] text-[#666] hover:text-white hover:border-[#555]"
                }`}
              >
                All
              </button>
              {allTags.slice(0, 12).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                    selectedTag === tag
                      ? "border-white text-white"
                      : "border-[#333] text-[#666] hover:text-white hover:border-[#555]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}

          {/* Posts */}
          {loading ? (
            <div className="text-center text-[#666] py-20">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-[#666] py-20">No posts yet.</div>
          ) : (
            <div className="space-y-4">
              {filtered.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" },
                    },
                  }}
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="card p-6 hover:border-[#333] transition-colors group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-[16px] font-medium mb-2 group-hover:text-white transition-colors text-[#ccc]">
                            {post.title}
                          </h2>
                          {post.subtitle && (
                            <p className="text-[13px] text-[#777] mb-3">{post.subtitle}</p>
                          )}
                          {post.excerpt && (
                            <p className="text-[13px] text-[#555] mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-[11px] text-[#555]">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span className="text-[#333]">/</span>
                            <span>{post.readTime} min read</span>
                            {post.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full border border-[#222] text-[#555]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-[#333] group-hover:text-[#666] transition-colors text-[18px] mt-1 shrink-0">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
