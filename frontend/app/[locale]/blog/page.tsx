'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { BLOG_POSTS, BLOG_CATEGORIES, getRecentPosts } from '@/data/blogPosts';
import { Calendar, User, Tag, ArrowRight, TrendingUp } from 'lucide-react';

export default function BlogPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEnglish = locale === 'en';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = selectedCategory === 'all' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => 
        post.category === selectedCategory || post.categoryEn === selectedCategory
      );

  const featuredPosts = BLOG_POSTS.filter(p => p.featured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(isEnglish ? 'en-US' : 'pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-12 h-12 mr-3" />
              <h1 className="text-5xl font-bold">
                {isEnglish ? 'News & Blog' : 'Aktualności i Blog'}
              </h1>
            </div>
            <p className="text-xl opacity-90">
              {isEnglish 
                ? 'Latest news, expert tips, and industry trends from SAN-BUD'
                : 'Najnowsze informacje, porady ekspertów i trendy branżowe od SAN-BUD'}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {isEnglish ? 'All Posts' : 'Wszystkie'}
            </button>
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category.name || selectedCategory === category.nameEn
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {isEnglish ? category.nameEn : category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'all' && featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {isEnglish ? '⭐ Featured Posts' : '⭐ Wyróżnione Artykuły'}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border-2 border-blue-200 hover:border-blue-400"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-48 flex items-center justify-center">
                    <div className="text-white text-center p-6">
                      <span className="inline-block px-4 py-1 bg-yellow-400 text-blue-900 rounded-full text-sm font-bold mb-3">
                        {isEnglish ? 'FEATURED' : 'WYRÓŻNIONE'}
                      </span>
                      <h3 className="text-2xl font-bold">
                        {isEnglish ? post.titleEn : post.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {isEnglish ? post.categoryEn : post.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {isEnglish ? post.excerptEn : post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                        {isEnglish ? 'Read more' : 'Czytaj więcej'}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'all' 
              ? (isEnglish ? 'All Articles' : 'Wszystkie Artykuły')
              : (isEnglish 
                  ? `${BLOG_CATEGORIES.find(c => c.name === selectedCategory)?.nameEn || selectedCategory}` 
                  : selectedCategory)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 flex items-center justify-center p-6">
                  <h3 className="text-xl font-bold text-gray-800 text-center line-clamp-2">
                    {isEnglish ? post.titleEn : post.title}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {isEnglish ? post.categoryEn : post.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {isEnglish ? post.excerptEn : post.excerpt}
                  </p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5" />
                      {post.author}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                      {isEnglish ? 'Read article' : 'Czytaj artykuł'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white text-center shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            {isEnglish ? 'Need Expert Advice?' : 'Potrzebujesz Porady Eksperta?'}
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {isEnglish 
              ? 'Our specialists are available 24/7 to help you'
              : 'Nasi specjaliści są dostępni 24/7, aby Ci pomóc'}
          </p>
          <a
            href="tel:+48503691808"
            className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
          >
            📞 503-691-808
          </a>
        </div>
      </div>
    </div>
  );
}
