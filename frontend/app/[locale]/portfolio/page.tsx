'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
}

export default function PortfolioPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Portfolio projects - 9 carefully selected images (3x3 grid)
  const projects: Project[] = [
    {
      id: 1,
      image: '/images/IMG_6028.jpg',
      title: 'Instalacja wodna',
      category: 'installation',
      description: 'Profesjonalny montaż instalacji wodno-kanalizacyjnej'
    },
    {
      id: 2,
      image: '/images/IMG_6134.jpg',
      title: 'Instalacja CO',
      category: 'heating',
      description: 'Centralne ogrzewanie z nowoczesnym kotłem'
    },
    {
      id: 3,
      image: '/images/IMG_6241.jpg',
      title: 'Ogrzewanie podłogowe',
      category: 'heating',
      description: 'Montaż nowoczesnego ogrzewania podłogowego'
    },
    {
      id: 4,
      image: '/images/IMG_6545.jpg',
      title: 'Montaż urządzeń',
      category: 'installation',
      description: 'Instalacja urządzeń technicznych'
    },
    {
      id: 5,
      image: '/images/IMG_6644.jpg',
      title: 'Urządzenia zewnętrzne',
      category: 'plumbing',
      description: 'Montaż urządzeń zewnętrznych'
    },
    {
      id: 6,
      image: '/images/IMG_6826.jpg',
      title: 'Montaż techniczny',
      category: 'installation',
      description: 'Zaawansowany montaż systemów technicznych'
    },
    {
      id: 7,
      image: '/images/IMG_6828.jpg',
      title: 'System wodny',
      category: 'installation',
      description: 'Kompleksowy system wodny i kanalizacyjny'
    },
    {
      id: 8,
      image: '/images/IMG_6150.jpg',
      title: 'System ogrzewania',
      category: 'heating',
      description: 'Efektywne rozwiązania grzewcze'
    },
    {
      id: 9,
      image: '/images/IMG_6645.jpg',
      title: 'Instalacje zewnętrzne',
      category: 'plumbing',
      description: 'Systemy instalacyjne na zewnątrz budynku'
    },
  ];

  // Google Reviews data - prawdziwe opinie z Google
  const reviews = [
    {
      id: 1,
      name: 'Celina Dziedzic',
      rating: 5,
      date: 'Listopad 2024',
      text: 'Bardzo profesjonalna i słowna ekipa. Montaż ogrzewania podłogowego i hydrauliki wykonany czysto, terminowo i w rozsądnej cenie. Polecam! Świetną robotę robicie chłopaki!',
      avatar: 'CD'
    },
    {
      id: 2,
      name: 'Dominik Czarnecki',
      rating: 5,
      date: 'Październik 2024',
      text: 'Zdecydowanie polecam firmę San-bud! Profesjonalizm, rzetelność i szybka realizacja zleceń to ich mocne strony. Ekipa bardzo dobrze przygotowana, a komunikacja bez zarzutów.',
      avatar: 'DC'
    },
    {
      id: 3,
      name: 'Arkadiusz Nowicki',
      rating: 5,
      date: 'Wrzesień 2024',
      text: 'Pełen profesjonalizm – szybki kontakt, terminowa realizacja i świetna jakość pracy. Hydraulicy z San-Bud znają się na rzeczy, doradzili najlepsze rozwiązania i wszystko działa bez zarzutu.',
      avatar: 'AN'
    },
    {
      id: 4,
      name: 'Beata Najechalska',
      rating: 5,
      date: 'Październik 2024',
      text: 'Bardzo szybka i sprawna obsługa klienta, usterka namierzona i usunięta, do tego pan Kamil doradził rozwiązanie problemu związanego z piecem. Polecam w 100%!',
      avatar: 'BN'
    },
    {
      id: 5,
      name: 'Kinga Winczewska',
      rating: 5,
      date: 'Sierpień 2024',
      text: 'Pełen profesjonalizm widać, że Pan Kamil zna się na rzeczy. Młoda i zgrana ekipa. Polecam z całego serca :)',
      avatar: 'KW'
    },
    {
      id: 6,
      name: 'Bartek Salamucha',
      rating: 5,
      date: 'Czerwiec 2024',
      text: 'Bardzo profesjonalna firma, młoda zgrana ekipa, przyjechała zamontowała Nam piec na pellet firmy Pereko, czas montażu 3 dni razem z wkładem kominowym. Polecam firmę!',
      avatar: 'BS'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Nasze realizacje
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Ponad 500+ zadowolonych klientów i setki ukończonych projektów. 
              Zobacz jak zmieniamy przestrzenie w piękne, funkcjonalne wnętrza.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">500+ Projektów</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">7 Lat Doświadczenia</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold">Gwarancja Jakości</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            Wszystkie ({projects.length})
          </button>
          <button
            onClick={() => setSelectedCategory('installation')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === 'installation'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            Instalacje ({projects.filter(p => p.category === 'installation').length})
          </button>
          <button
            onClick={() => setSelectedCategory('heating')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === 'heating'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            Ogrzewanie ({projects.filter(p => p.category === 'heating').length})
          </button>
          <button
            onClick={() => setSelectedCategory('plumbing')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              selectedCategory === 'plumbing'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
            }`}
          >
            Hydraulika ({projects.filter(p => p.category === 'plumbing').length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects
            .filter(project => selectedCategory === 'all' || project.category === selectedCategory)
            .map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedImage(project)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Info - shown on hover */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-bold text-xl mb-2">{project.title}</h3>
                  <p className="text-white/90 text-sm">{project.description}</p>
                </div>

                {/* View Icon */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-4">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-yellow-800">Opinie Klientów</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Co mówią nasi klienci?
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9</span>
            </div>
            <p className="text-gray-600">Na podstawie 69 opinii Google</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 48 48" fill="currentColor">
                    <path d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"/>
                    <path fill="#FFF" d="M34.7,25.9c0-0.7-0.6-1.3-1.3-1.3H26c-0.4,0-0.7-0.3-0.7-0.7V16c0-0.7-0.6-1.3-1.3-1.3s-1.3,0.6-1.3,1.3v7.9c0,0.4-0.3,0.7-0.7,0.7h-7.3c-0.7,0-1.3,0.6-1.3,1.3s0.6,1.3,1.3,1.3H22c0.4,0,0.7,0.3,0.7,0.7V35c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3v-7.1c0-0.4,0.3-0.7,0.7-0.7h7.4C34.1,27.2,34.7,26.6,34.7,25.9z"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Google Reviews CTA */}
          <div className="text-center mt-12">
            <a
              href="https://www.google.com/search?q=SAN+BUD+Hydraulika+Naszą+Pasją"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl font-bold text-gray-900 hover:text-blue-600 transition-all hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48" fill="currentColor">
                <path fill="#4285F4" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"/>
                <path fill="#FFF" d="M34.7,25.9c0-0.7-0.6-1.3-1.3-1.3H26c-0.4,0-0.7-0.3-0.7-0.7V16c0-0.7-0.6-1.3-1.3-1.3s-1.3,0.6-1.3,1.3v7.9c0,0.4-0.3,0.7-0.7,0.7h-7.3c-0.7,0-1.3,0.6-1.3,1.3s0.6,1.3,1.3,1.3H22c0.4,0,0.7,0.3,0.7,0.7V35c0,0.7,0.6,1.3,1.3,1.3s1.3-0.6,1.3-1.3v-7.1c0-0.4,0.3-0.7,0.7-0.7h7.4C34.1,27.2,34.7,26.6,34.7,25.9z"/>
              </svg>
              Zobacz wszystkie opinie na Google
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex-1 mb-4">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              <p className="text-white/80">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trust Badges Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12">
              Twoje bezpieczeństwo i jakość na pierwszym miejscu
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Certyfikaty */}
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Certyfikowane Uprawnienia</h3>
                <p className="text-gray-600 text-sm">Pełne uprawnienia gazowe, elektryczne i budowlane</p>
              </div>

              {/* Ubezpieczenie */}
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Pełne Ubezpieczenie</h3>
                <p className="text-gray-600 text-sm">OC i NNW dla Twojego spokoju</p>
              </div>

              {/* Gwarancja */}
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Długoterminowa Gwarancja</h3>
                <p className="text-gray-600 text-sm">Do 5 lat gwarancji na wykonane prace</p>
              </div>

              {/* Materiały */}
              <div className="text-center group hover:scale-105 transition-transform">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-xl transition-shadow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Sprawdzone Materiały</h3>
                <p className="text-gray-600 text-sm">Tylko renomowani producenci i certyfikaty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Gotowy na własny projekt?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Skontaktuj się z nami, aby omówić Twój projekt. Zapewniamy profesjonalne doradztwo i bezpłatną wycenę.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+48503691808"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Zadzwoń: 503 691 808
            </a>
            <Link
              href={`/${locale}/contact`}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Formularz kontaktowy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
