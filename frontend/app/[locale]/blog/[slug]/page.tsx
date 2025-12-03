'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getRecentPosts, BLOG_POSTS } from '@/data/blogPosts';
import { Calendar, User, Tag, ArrowLeft, Clock } from 'lucide-react';

interface BlogPostPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = useLocale();
  const isEnglish = locale === 'en';
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getRecentPosts(3).filter(p => p.slug !== params.slug);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const readingTime = estimateReadingTime(isEnglish ? post.contentEn : post.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEnglish ? 'Back to Blog' : 'Powrót do Bloga'}
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {isEnglish ? post.categoryEn : post.category}
              </span>
              {post.featured && (
                <span className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold">
                  {isEnglish ? '⭐ Featured' : '⭐ Wyróżnione'}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isEnglish ? post.titleEn : post.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {readingTime} {isEnglish ? 'min read' : 'min czytania'}
                </span>
              </div>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              {isEnglish ? post.excerptEn : post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-gray-700 prose-li:mb-2
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: isEnglish ? post.contentEn : post.content }}
            />
          </div>

          {/* Tags */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <Tag className="w-5 h-5 mr-2 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {isEnglish ? 'Tags' : 'Tagi'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(isEnglish ? post.tagsEn : post.tags).map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mb-12">
            <h3 className="text-2xl font-bold mb-3">
              {isEnglish ? 'Need Professional Help?' : 'Potrzebujesz Profesjonalnej Pomocy?'}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {isEnglish 
                ? 'Contact our experts - free consultation and quote!'
                : 'Skontaktuj się z naszymi ekspertami - darmowa konsultacja i wycena!'}
            </p>
            <a
              href="tel:+48503691808"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
            >
              📞 503-691-808
            </a>
          </div>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {isEnglish ? 'Recent Articles' : 'Ostatnie Artykuły'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map((recentPost) => (
                  <Link
                    key={recentPost.id}
                    href={`/${locale}/blog/${recentPost.slug}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-32 flex items-center justify-center p-4">
                      <h4 className="text-sm font-bold text-gray-800 text-center line-clamp-2">
                        {isEnglish ? recentPost.titleEn : recentPost.title}
                      </h4>
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium mb-2">
                        {isEnglish ? recentPost.categoryEn : recentPost.category}
                      </span>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {isEnglish ? recentPost.excerptEn : recentPost.excerpt}
                      </p>
                      <div className="text-xs text-gray-500">
                        {formatDate(recentPost.date)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

// Generate static params for all blog posts
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}
