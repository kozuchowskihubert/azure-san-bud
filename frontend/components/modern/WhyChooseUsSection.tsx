'use client';

import { CheckCircle2, Award, Shield, TrendingUp } from 'lucide-react';

interface WhyChooseUsSectionProps {
  locale: 'pl' | 'en';
}

const benefits = [
  {
    icon: CheckCircle2,
    titlePL: 'Doświadczenie i Wiedza',
    titleEN: 'Experience & Expertise',
    descriptionPL: '7 lat praktyki w branży hydraulicznej. Realizujemy projekty od prostych napraw po kompleksowe instalacje.',
    descriptionEN: '7 years of plumbing industry practice. We handle projects from simple repairs to complex installations.',
  },
  {
    icon: Award,
    titlePL: 'Certyfikaty i Uprawnienia',
    titleEN: 'Certifications & Credentials',
    descriptionPL: 'Pełne uprawnienia gazowe, elektryczne i budowlane. Wszystkie prace wykonujemy zgodnie z normami i przepisami.',
    descriptionEN: 'Full gas, electrical, and construction credentials. All work complies with standards and regulations.',
  },
  {
    icon: Shield,
    titlePL: 'Gwarancja Jakości',
    titleEN: 'Quality Guarantee',
    descriptionPL: 'Używamy wyłącznie sprawdzonych materiałów renomowanych producentów. Udzielamy długoterminowej gwarancji.',
    descriptionEN: 'We use only proven materials from renowned manufacturers. We provide long-term warranties.',
  },
  {
    icon: TrendingUp,
    titlePL: 'Terminowość i Rzetelność',
    titleEN: 'Timeliness & Reliability',
    descriptionPL: 'Dotrzymujemy ustalonych terminów i budżetu. Transparentna komunikacja na każdym etapie realizacji.',
    descriptionEN: 'We meet agreed deadlines and budgets. Transparent communication at every stage of implementation.',
  },
];

export default function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const isEnglish = locale === 'en';

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-6">
              <Award className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-800">
                {isEnglish ? 'Why Choose Us' : 'Dlaczego My'}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {isEnglish 
                ? 'Your Trusted Plumbing Partner' 
                : 'Twój Zaufany Partner Hydrauliczny'}
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {isEnglish
                ? 'Since 2018, we have been providing professional plumbing services in the Mazowsze region. Our team of specialists ensures the highest quality of workmanship and customer satisfaction.'
                : 'Od 2018 roku świadczymy profesjonalne usługi hydrauliczne w województwie mazowieckim. Nasz zespół specjalistów zapewnia najwyższą jakość wykonania i satysfakcję klientów.'}
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-teal-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {isEnglish ? benefit.titleEN : benefit.titlePL}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {isEnglish ? benefit.descriptionEN : benefit.descriptionPL}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white">
              <div className="text-5xl font-bold mb-2">7+</div>
              <div className="text-teal-100 text-lg">
                {isEnglish ? 'Years Experience' : 'Lat Doświadczenia'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <div className="text-5xl font-bold mb-2">2500+</div>
              <div className="text-orange-100 text-lg">
                {isEnglish ? 'Projects Completed' : 'Zrealizowanych Projektów'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100 text-lg">
                {isEnglish ? 'Client Satisfaction' : 'Zadowolenia Klientów'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100 text-lg">
                {isEnglish ? 'Support Available' : 'Wsparcie Dostępne'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
