/**
 * Blog Posts Data - News and Updates
 * Data for SAN-BUD blog/news section (Aktualności)
 */

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  category: string;
  categoryEn: string;
  author: string;
  date: string;
  imageUrl?: string;
  tags: string[];
  tagsEn: string[];
  featured: boolean;
}

export const BLOG_CATEGORIES = [
  { id: 'instalacje', name: 'Instalacje', nameEn: 'Installations' },
  { id: 'ogrzewanie', name: 'Ogrzewanie', nameEn: 'Heating' },
  { id: 'lazienki', name: 'Łazienki', nameEn: 'Bathrooms' },
  { id: 'porady', name: 'Porady', nameEn: 'Tips & Advice' },
  { id: 'aktualnosci', name: 'Aktualności', nameEn: 'News' }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'nowoczesne-systemy-grzewcze-2025',
    title: 'Nowoczesne Systemy Grzewcze w 2025 - Trendy i Rozwiązania',
    titleEn: 'Modern Heating Systems in 2025 - Trends and Solutions',
    excerpt: 'Poznaj najnowsze trendy w ogrzewaniu domów i mieszkań. Pompy ciepła, kotły kondensacyjne i inteligentne systemy sterowania.',
    excerptEn: 'Discover the latest trends in home heating. Heat pumps, condensing boilers and smart control systems.',
    content: `<h2>Rewolucja w Ogrzewaniu</h2>
<p>Rok 2025 przynosi znaczące zmiany w podejściu do ogrzewania domów i mieszkań. Rosnące ceny energii oraz wymogi ekologiczne sprawiają, że coraz więcej właścicieli nieruchomości decyduje się na modernizację swoich systemów grzewczych.</p>

<h3>Pompy Ciepła - Przyszłość Ogrzewania</h3>
<p>Pompy ciepła stają się standardem w nowoczesnym budownictwie. Ich wydajność energetyczna (COP na poziomie 4-5) oznacza, że z 1 kW energii elektrycznej możemy uzyskać nawet 5 kW energii cieplnej. SAN-BUD montuje pompy ciepła wszystkich wiodących producentów.</p>

<h3>Kotły Kondensacyjne</h3>
<p>Dla osób preferujących tradycyjne źródła ciepła, polecamy kotły kondensacyjne najnowszej generacji. Ich sprawność przekracza 95%, co przekłada się na znaczne oszczędności w rachunkach za gaz.</p>

<h3>Inteligentne Sterowanie</h3>
<p>Nowoczesne systemy sterowania pozwalają na zdalne zarządzanie ogrzewaniem przez aplikację mobilną. Programowanie temperatur dla poszczególnych pomieszczeń, analiza zużycia energii i automatyczna optymalizacja pracy instalacji to tylko niektóre z możliwości.</p>

<p><strong>Skontaktuj się z nami</strong> - dobierzemy optymalne rozwiązanie dla Twojego domu!</p>`,
    contentEn: `<h2>Heating Revolution</h2>
<p>2025 brings significant changes in home heating approaches. Rising energy prices and environmental requirements mean more property owners are modernizing their heating systems.</p>

<h3>Heat Pumps - The Future of Heating</h3>
<p>Heat pumps are becoming standard in modern construction. Their energy efficiency (COP of 4-5) means we can get up to 5 kW of thermal energy from 1 kW of electricity. SAN-BUD installs heat pumps from all leading manufacturers.</p>

<h3>Condensing Boilers</h3>
<p>For those preferring traditional heat sources, we recommend latest generation condensing boilers. Their efficiency exceeds 95%, translating to significant savings on gas bills.</p>

<h3>Smart Control</h3>
<p>Modern control systems allow remote heating management via mobile app. Temperature programming for individual rooms, energy consumption analysis, and automatic system optimization are just some of the possibilities.</p>

<p><strong>Contact us</strong> - we'll find the optimal solution for your home!</p>`,
    category: 'Ogrzewanie',
    categoryEn: 'Heating',
    author: 'SAN-BUD Team',
    date: '2025-01-15',
    tags: ['pompy ciepła', 'kotły kondensacyjne', 'ogrzewanie', 'modernizacja'],
    tagsEn: ['heat pumps', 'condensing boilers', 'heating', 'modernization'],
    featured: true
  },
  {
    id: '2',
    slug: 'lazienka-pod-klucz-jak-zaplanowac',
    title: 'Łazienka Pod Klucz - Jak Zaplanować Remont?',
    titleEn: 'Turnkey Bathroom - How to Plan Renovation?',
    excerpt: 'Przewodnik krok po kroku dla osób planujących kompleksowy remont łazienki. Od projektu po odbiór końcowy.',
    excerptEn: 'Step-by-step guide for those planning comprehensive bathroom renovation. From design to final acceptance.',
    content: `<h2>Planowanie Remontu Łazienki</h2>
<p>Remont łazienki to inwestycja na lata. Odpowiednie przygotowanie i wybór sprawdzonego wykonawcy to klucz do sukcesu. Przedstawiamy pełen proces realizacji łazienki "pod klucz".</p>

<h3>Krok 1: Projekt i Wizualizacja</h3>
<p>Profesjonalny projekt to podstawa. SAN-BUD oferuje bezpłatne projekty łazienek z wizualizacją 3D. Wspólnie ustalamy układ elementów, dobieramy płytki, armaturę i wyposażenie.</p>

<h3>Krok 2: Rozbiórka i Przygotowanie</h3>
<p>Demontaż starej instalacji, skucie płytek, przygotowanie ścian i podłogi. Wszystkie prace wykonujemy szybko i czysto, z wywozem gruzu.</p>

<h3>Krok 3: Instalacje Sanitarne</h3>
<p>Nowe instalacje wody, kanalizacji, ogrzewania podłogowego. Używamy tylko certyfikowanych materiałów z gwarancją producenta.</p>

<h3>Krok 4: Prace Wykończeniowe</h3>
<p>Układanie płytek, montaż kabiny prysznicowej, umywalki, WC, oświetlenia. Każdy detal dopracowany perfekcyjnie.</p>

<h3>Krok 5: Odbiór i Gwarancja</h3>
<p>Wspólny odbiór prac, instruktaż użytkowania, przekazanie dokumentacji. Gwarancja na wykonane prace - 5 lat!</p>

<p><strong>Zadzwoń 503-691-808</strong> - darmowa wycena w 24h!</p>`,
    contentEn: `<h2>Planning Bathroom Renovation</h2>
<p>Bathroom renovation is a long-term investment. Proper preparation and choosing a reliable contractor are keys to success. We present the complete turnkey bathroom process.</p>

<h3>Step 1: Design and Visualization</h3>
<p>Professional design is fundamental. SAN-BUD offers free bathroom designs with 3D visualization. Together we determine element layout, select tiles, fittings and equipment.</p>

<h3>Step 2: Demolition and Preparation</h3>
<p>Dismantling old installations, chipping off tiles, preparing walls and floor. All work done quickly and cleanly, with debris removal.</p>

<h3>Step 3: Sanitary Installations</h3>
<p>New water, sewage, and underfloor heating installations. We use only certified materials with manufacturer warranty.</p>

<h3>Step 4: Finishing Works</h3>
<p>Tile laying, shower cabin assembly, sink, toilet, lighting installation. Every detail perfected.</p>

<h3>Step 5: Acceptance and Warranty</h3>
<p>Joint work acceptance, usage instructions, documentation handover. 5-year warranty on completed work!</p>

<p><strong>Call 503-691-808</strong> - free quote within 24h!</p>`,
    category: 'Łazienki',
    categoryEn: 'Bathrooms',
    author: 'Jacek Nowak - Kierownik Projektów',
    date: '2025-01-10',
    tags: ['łazienka', 'remont', 'projekt', 'pod klucz'],
    tagsEn: ['bathroom', 'renovation', 'design', 'turnkey'],
    featured: true
  },
  {
    id: '3',
    slug: 'awaryjne-naprawy-hydrauliczne-zima',
    title: 'Awaryjne Naprawy Hydrauliczne Zimą - Porady Eksperta',
    titleEn: 'Emergency Plumbing Repairs in Winter - Expert Tips',
    excerpt: 'Jak uniknąć awarii instalacji w sezonie zimowym? Praktyczne porady i numery alarmowe na 24/7.',
    excerptEn: 'How to avoid installation failures in winter? Practical tips and 24/7 emergency numbers.',
    content: `<h2>Zima a Instalacje Hydrauliczne</h2>
<p>Sezon zimowy to okres wzmożonego ryzyka awarii instalacji wodnych i grzewczych. Niskie temperatury, zamarzanie rur, przeciążone kotły - znamy to wszystko doskonale.</p>

<h3>Najczęstsze Awarie Zimowe</h3>
<ul>
<li><strong>Zamarzanie rur wodnych</strong> - szczególnie w piwnicach i garażach</li>
<li><strong>Awarie kotłów grzewczych</strong> - przeciążenie systemu przy mrozach</li>
<li><strong>Nieszczelności w instalacji CO</strong> - spadek ciśnienia, wyziębienie domu</li>
<li><strong>Zatkane odpływy</strong> - zamarzanie kanalizacji zewnętrznej</li>
</ul>

<h3>Jak Zapobiegać?</h3>
<ol>
<li>Izolacja rur w nieogrzewanych pomieszczeniach</li>
<li>Regularne serwisy kotłów przed sezonem</li>
<li>Kontrola ciśnienia w instalacji CO</li>
<li>Ocieplenie pokryw studzienek kanalizacyjnych</li>
</ol>

<h3>Awaria? Dzwoń 24/7!</h3>
<p>SAN-BUD zapewnia serwis awaryjny 7 dni w tygodniu. Nasz zespół interwencyjny dojeżdża w czasie do 2 godzin na terenie Warszawy i okolic.</p>

<p><strong>Hotline: 503-691-808</strong></p>

<h3>Co Robimy w Ramach Interwencji?</h3>
<ul>
<li>Rozmrażanie zamarzniętych rur</li>
<li>Naprawa przecieków i nieszczelności</li>
<li>Przywracanie ciśnienia w instalacji</li>
<li>Awaryjny rozruch kotłów</li>
<li>Udrażnianie kanalizacji</li>
</ul>

<p>Nie czekaj aż awaria się pogłębi - zadzwoń natychmiast!</p>`,
    contentEn: `<h2>Winter and Plumbing Installations</h2>
<p>Winter season is a period of increased risk for water and heating installation failures. Low temperatures, freezing pipes, overloaded boilers - we know it all too well.</p>

<h3>Most Common Winter Failures</h3>
<ul>
<li><strong>Frozen water pipes</strong> - especially in basements and garages</li>
<li><strong>Heating boiler failures</strong> - system overload in freezing weather</li>
<li><strong>Central heating leaks</strong> - pressure drop, house cooling</li>
<li><strong>Clogged drains</strong> - frozen external sewage</li>
</ul>

<h3>How to Prevent?</h3>
<ol>
<li>Pipe insulation in unheated rooms</li>
<li>Regular boiler service before season</li>
<li>Central heating pressure monitoring</li>
<li>Sewage manhole cover insulation</li>
</ol>

<h3>Emergency? Call 24/7!</h3>
<p>SAN-BUD provides emergency service 7 days a week. Our intervention team arrives within 2 hours in Warsaw and surrounding areas.</p>

<p><strong>Hotline: 503-691-808</strong></p>

<h3>What We Do During Intervention?</h3>
<ul>
<li>Thawing frozen pipes</li>
<li>Leak and seal repairs</li>
<li>Installation pressure restoration</li>
<li>Emergency boiler startup</li>
<li>Drain unclogging</li>
</ul>

<p>Don't wait for the failure to worsen - call immediately!</p>`,
    category: 'Porady',
    categoryEn: 'Tips & Advice',
    author: 'Marek Kowalski - Serwis Techniczny',
    date: '2025-01-05',
    tags: ['awarie', 'zima', 'serwis 24/7', 'porady'],
    tagsEn: ['emergencies', 'winter', '24/7 service', 'tips'],
    featured: false
  },
  {
    id: '4',
    slug: 'instalacje-wod-kan-w-nowym-domu',
    title: 'Instalacje Wod-Kan w Nowym Domu - Kompletny Przewodnik',
    titleEn: 'Water & Sewage in New Home - Complete Guide',
    excerpt: 'Budowa domu? Dowiedz się wszystko o instalacjach wodno-kanalizacyjnych od fundamentów po dach.',
    excerptEn: 'Building a house? Learn everything about water and sewage installations from foundation to roof.',
    content: `<h2>Instalacje Sanitarne w Nowym Domu</h2>
<p>Budowa domu to wielkie przedsięwzięcie. Instalacje wodno-kanalizacyjne to jeden z najważniejszych elementów, który musi być dobrze zaplanowany i wykonany.</p>

<h3>Etap Projektowania</h3>
<p>Profesjonalny projekt instalacji sanitarnych powinien uwzględniać:</p>
<ul>
<li>Układ pomieszczeń sanitarnych (łazienki, WC, pralnia)</li>
<li>Źródło wody (wodociąg miejski, studnia głębinowa)</li>
<li>Odprowadzanie ścieków (kanalizacja miejska, szambo, oczyszczalnia)</li>
<li>Instalacja cyrkulacji ciepłej wody</li>
<li>Punkty czerpal ne na zewnątrz domu</li>
</ul>

<h3>Materiały - Co Wybrać?</h3>
<p><strong>Rury wodne:</strong> Polecamy wielowarstwowe rury PEX lub PP - trwałe, bezpieczne, łatwe w montażu.</p>
<p><strong>Kanalizacja:</strong> Rury PVC o odpowiedniej średnicy (110mm dla pionów, 50mm dla odpływów).</p>
<p><strong>Armatura:</strong> Renomowani producenci - Grohe, Hansgrohe, Kludi - gwarancja jakości na lata.</p>

<h3>Montaż Krok Po Kroku</h3>
<ol>
<li><strong>Fundamenty</strong> - przepusty pod instalacje zewnętrzne</li>
<li><strong>Stan surowy</strong> - prowadzenie pionów i rozdzielnic</li>
<li><strong>Tynki</strong> - podejścia do punktów czerpalnych</li>
<li><strong>Wykończenie</strong> - montaż armatury i wyposażenia</li>
</ol>

<h3>Dlaczego SAN-BUD?</h3>
<ul>
<li>✅ 15 lat doświadczenia w budownictwie jednorodzinnym</li>
<li>✅ Kompleksowa realizacja - od projektu po odbiór</li>
<li>✅ Certyfikowane materiały z gwarancją</li>
<li>✅ Stała współpraca z ekipami budowlanymi</li>
<li>✅ Konkurencyjne ceny - wycena gratis</li>
</ul>

<p><strong>Buduj z profesjonalistami - zadzwoń 503-691-808</strong></p>`,
    contentEn: `<h2>Sanitary Installations in New Home</h2>
<p>Building a house is a major undertaking. Water and sewage installations are one of the most important elements that must be well planned and executed.</p>

<h3>Design Stage</h3>
<p>Professional sanitary installation design should include:</p>
<ul>
<li>Sanitary room layout (bathrooms, toilets, laundry)</li>
<li>Water source (city water, deep well)</li>
<li>Sewage disposal (city sewage, septic tank, treatment plant)</li>
<li>Hot water circulation installation</li>
<li>External water points</li>
</ul>

<h3>Materials - What to Choose?</h3>
<p><strong>Water pipes:</strong> We recommend multi-layer PEX or PP pipes - durable, safe, easy to install.</p>
<p><strong>Sewage:</strong> PVC pipes of appropriate diameter (110mm for risers, 50mm for drains).</p>
<p><strong>Fittings:</strong> Renowned manufacturers - Grohe, Hansgrohe, Kludi - quality guarantee for years.</p>

<h3>Installation Step by Step</h3>
<ol>
<li><strong>Foundations</strong> - passages for external installations</li>
<li><strong>Shell state</strong> - running risers and distributors</li>
<li><strong>Plasters</strong> - approaches to draw-off points</li>
<li><strong>Finishing</strong> - fitting and equipment assembly</li>
</ol>

<h3>Why SAN-BUD?</h3>
<ul>
<li>✅ 15 years experience in single-family construction</li>
<li>✅ Complete realization - from design to acceptance</li>
<li>✅ Certified materials with warranty</li>
<li>✅ Constant cooperation with construction teams</li>
<li>✅ Competitive prices - free quote</li>
</ul>

<p><strong>Build with professionals - call 503-691-808</strong></p>`,
    category: 'Instalacje',
    categoryEn: 'Installations',
    author: 'Piotr Wiśniewski - Kierownik Budowy',
    date: '2024-12-28',
    tags: ['nowy dom', 'instalacje', 'wod-kan', 'budowa'],
    tagsEn: ['new home', 'installations', 'water-sewage', 'construction'],
    featured: false
  },
  {
    id: '5',
    slug: 'podlogowka-czy-grzejniki',
    title: 'Ogrzewanie Podłogowe czy Grzejniki? Porównanie Rozwiązań',
    titleEn: 'Underfloor Heating or Radiators? Solution Comparison',
    excerpt: 'Analiza porównawcza dwóch najpopularniejszych systemów ogrzewania. Poznaj zalety i wady każdego rozwiązania.',
    excerptEn: 'Comparative analysis of two most popular heating systems. Learn advantages and disadvantages of each solution.',
    content: `<h2>Ogrzewanie Podłogowe vs Grzejniki</h2>
<p>Wybór systemu ogrzewania to jedna z kluczowych decyzji podczas budowy lub remontu domu. Porównajmy obie opcje.</p>

<h3>Ogrzewanie Podłogowe - Zalety</h3>
<ul>
<li>✅ Równomierny rozkład ciepła w pomieszczeniu</li>
<li>✅ Niższa temperatura pracy (35-45°C) = oszczędności</li>
<li>✅ Brak grzejników na ścianach - więcej miejsca</li>
<li>✅ Komfort cieplny - ciepłe podłogi</li>
<li>✅ Idealne dla pomp ciepła i kotłów kondensacyjnych</li>
</ul>

<h3>Ogrzewanie Podłogowe - Wady</h3>
<ul>
<li>❌ Wyższy koszt montażu</li>
<li>❌ Dłuższy czas nagrzewania pomieszczenia</li>
<li>❌ Wymaga odpowiedniej posadzki</li>
<li>❌ Trudniejszy dostęp w razie awarii</li>
</ul>

<h3>Grzejniki - Zalety</h3>
<ul>
<li>✅ Niższy koszt instalacji</li>
<li>✅ Szybkie nagrzewanie pomieszczenia</li>
<li>✅ Łatwy serwis i wymiana</li>
<li>✅ Możliwość suszenia ręczników (grzejniki łazienkowe)</li>
<li>✅ Precyzyjna regulacja temperatury w każdym pokoju</li>
</ul>

<h3>Grzejniki - Wady</h3>
<ul>
<li>❌ Nierównomierny rozkład ciepła</li>
<li>❌ Zajmują przestrzeń na ścianach</li>
<li>❌ Wyższa temperatura pracy = wyższe koszty</li>
<li>❌ Mniej estetyczne rozwiązanie</li>
</ul>

<h3>Rozwiązanie Hybrydowe</h3>
<p>Coraz popularniejsze staje się łączenie obu systemów:</p>
<ul>
<li>Ogrzewanie podłogowe w łazienkach i na parterze</li>
<li>Grzejniki w sypialniach i na piętrze</li>
<li>Optymalizacja kosztów i komfortu</li>
</ul>

<h3>Eksperci SAN-BUD Pomogą Wybrać</h3>
<p>Każdy dom jest inny. Nasze doświadczenie pozwala dobrać optymalne rozwiązanie uwzględniając:</p>
<ul>
<li>Budżet inwestycji</li>
<li>Źródło ciepła</li>
<li>Izolację budynku</li>
<li>Preferencje użytkowników</li>
</ul>

<p><strong>Darmowa konsultacja - 503-691-808</strong></p>`,
    contentEn: `<h2>Underfloor Heating vs Radiators</h2>
<p>Choosing a heating system is one of key decisions during house construction or renovation. Let's compare both options.</p>

<h3>Underfloor Heating - Advantages</h3>
<ul>
<li>✅ Even heat distribution in room</li>
<li>✅ Lower operating temperature (35-45°C) = savings</li>
<li>✅ No radiators on walls - more space</li>
<li>✅ Thermal comfort - warm floors</li>
<li>✅ Perfect for heat pumps and condensing boilers</li>
</ul>

<h3>Underfloor Heating - Disadvantages</h3>
<ul>
<li>❌ Higher installation cost</li>
<li>❌ Longer room heating time</li>
<li>❌ Requires appropriate flooring</li>
<li>❌ More difficult access in case of failure</li>
</ul>

<h3>Radiators - Advantages</h3>
<ul>
<li>✅ Lower installation cost</li>
<li>✅ Fast room heating</li>
<li>✅ Easy service and replacement</li>
<li>✅ Towel drying option (bathroom radiators)</li>
<li>✅ Precise temperature control in each room</li>
</ul>

<h3>Radiators - Disadvantages</h3>
<ul>
<li>❌ Uneven heat distribution</li>
<li>❌ Take up wall space</li>
<li>❌ Higher operating temperature = higher costs</li>
<li>❌ Less aesthetic solution</li>
</ul>

<h3>Hybrid Solution</h3>
<p>Combining both systems is becoming increasingly popular:</p>
<ul>
<li>Underfloor heating in bathrooms and ground floor</li>
<li>Radiators in bedrooms and upstairs</li>
<li>Cost and comfort optimization</li>
</ul>

<h3>SAN-BUD Experts Will Help Choose</h3>
<p>Every house is different. Our experience allows us to select optimal solution considering:</p>
<ul>
<li>Investment budget</li>
<li>Heat source</li>
<li>Building insulation</li>
<li>User preferences</li>
</ul>

<p><strong>Free consultation - 503-691-808</strong></p>`,
    category: 'Ogrzewanie',
    categoryEn: 'Heating',
    author: 'SAN-BUD Team',
    date: '2024-12-20',
    tags: ['ogrzewanie podłogowe', 'grzejniki', 'porównanie', 'porady'],
    tagsEn: ['underfloor heating', 'radiators', 'comparison', 'advice'],
    featured: false
  }
];

// Helper functions
export const getFeaturedPosts = () => BLOG_POSTS.filter(post => post.featured);
export const getPostsByCategory = (category: string) => 
  BLOG_POSTS.filter(post => post.category === category || post.categoryEn === category);
export const getPostBySlug = (slug: string) => 
  BLOG_POSTS.find(post => post.slug === slug);
export const getRecentPosts = (limit: number = 3) => 
  [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
