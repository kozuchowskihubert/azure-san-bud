'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Project {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
}

export default function PortfolioPage() {
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Portfolio projects with actual images
  const projects: Project[] = [
    {
      id: 1,
      image: '/images/IMG_6028.jpg',
      title: 'Nowoczesna łazienka',
      category: 'bathroom',
      description: 'Kompleksowy remont łazienki z instalacją wodną i ogrzewaniem podłogowym'
    },
    {
      id: 2,
      image: '/images/IMG_6030.jpg',
      title: 'System grzewczy',
      category: 'heating',
      description: 'Montaż centralnego ogrzewania z pompą ciepła'
    },
    {
      id: 3,
      image: '/images/IMG_6033.jpg',
      title: 'Instalacja wodno-kanalizacyjna',
      category: 'plumbing',
      description: 'Profesjonalna instalacja wodno-kanalizacyjna w nowym budynku'
    },
    {
      id: 4,
      image: '/images/IMG_6036.jpg',
      title: 'Łazienka premium',
      category: 'bathroom',
      description: 'Ekskluzywna łazienka z wysokiej jakości armaturą'
    },
    {
      id: 5,
      image: '/images/IMG_6064.jpg',
      title: 'System ogrzewania',
      category: 'heating',
      description: 'Nowoczesne rozwiązania grzewcze dla komfortu użytkowników'
    },
    {
      id: 6,
      image: '/images/IMG_6134.jpg',
      title: 'Instalacje sanitarne',
      category: 'plumbing',
      description: 'Kompleksowe instalacje sanitarne w budynku mieszkalnym'
    },
    {
      id: 7,
      image: '/images/IMG_6150.jpg',
      title: 'Remont łazienki',
      category: 'bathroom',
      description: 'Pełny remont łazienki od podstaw'
    },
    {
      id: 8,
      image: '/images/IMG_6152.jpg',
      title: 'System wodny',
      category: 'plumbing',
      description: 'Zaawansowany system wodny z filtracją'
    },
    {
      id: 9,
      image: '/images/IMG_6241.jpg',
      title: 'Montaż urządzeń',
      category: 'installation',
      description: 'Profesjonalny montaż urządzeń sanitarnych'
    },
    {
      id: 10,
      image: '/images/IMG_6545.jpg',
      title: 'Łazienka z wanną',
      category: 'bathroom',
      description: 'Elegancka łazienka z wolnostojącą wanną'
    },
    {
      id: 11,
      image: '/images/IMG_6547.jpg',
      title: 'Instalacja grzewcza',
      category: 'heating',
      description: 'Nowoczesna instalacja grzewcza z termostatami'
    },
    {
      id: 12,
      image: '/images/IMG_6556.jpg',
      title: 'System wentylacji',
      category: 'installation',
      description: 'Instalacja systemu wentylacji mechanicznej'
    },
    {
      id: 13,
      image: '/images/IMG_6644.jpg',
      title: 'Łazienka z prysznicem',
      category: 'bathroom',
      description: 'Nowoczesna kabina prysznicowa z hydromasażem'
    },
    {
      id: 14,
      image: '/images/IMG_6645.jpg',
      title: 'Instalacja CO',
      category: 'heating',
      description: 'Centralne ogrzewanie z kotłem kondensacyjnym'
    },
    {
      id: 15,
      image: '/images/IMG_6826.jpg',
      title: 'Remont kompleksowy',
      category: 'bathroom',
      description: 'Kompleksowy remont z wymianą wszystkich instalacji'
    },
    {
      id: 16,
      image: '/images/IMG_6827.jpg',
      title: 'Instalacja przemysłowa',
      category: 'plumbing',
      description: 'Instalacje wodno-kanalizacyjne w obiekcie przemysłowym'
    },
    {
      id: 17,
      image: '/images/IMG_6828.jpg',
      title: 'System uzdatniania',
      category: 'installation',
      description: 'Zaawansowany system uzdatniania wody'
    },
    {
      id: 18,
      image: '/images/IMG_6829.jpg',
      title: 'Łazienka designerska',
      category: 'bathroom',
      description: 'Designerska łazienka według indywidualnego projektu'
    },
    {
      id: 19,
      image: '/images/IMG_6830.jpg',
      title: 'Pompa ciepła',
      category: 'heating',
      description: 'Montaż i konfiguracja pompy ciepła'
    },
    {
      id: 20,
      image: '/images/IMG_6831.jpg',
      title: 'Instalacja sanitarna',
      category: 'plumbing',
      description: 'Profesjonalna instalacja sanitarna w budynku'
    },
  ];

  const categories = [
    { id: 'all', label: 'Wszystkie', icon: '🏠' },
    { id: 'bathroom', label: 'Łazienki', icon: '🛁' },
    { id: 'plumbing', label: 'Instalacje', icon: '💧' },
    { id: 'heating', label: 'Ogrzewanie', icon: '🔥' },
    { id: 'installation', label: 'Montaże', icon: '🔧' },
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

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

      {/* Filter Categories */}
      <section className="bg-white shadow-md sticky top-20 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  filter === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {cat.id === 'all' ? projects.length : projects.filter(p => p.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedImage(project)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Info */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                  <p className="text-white/90 text-sm line-clamp-2">{project.description}</p>
                </div>

                {/* View Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600 font-semibold">Brak projektów w tej kategorii</p>
          </div>
        )}
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
            <a
              href="/contact"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Formularz kontaktowy
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
