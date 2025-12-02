# SanBud Hydraulika - Frontend

Modern, professional Next.js frontend for SanBud Hydraulika with bilingual support (Polish/English).

## 🎨 Design System

### Color Scheme
**Hybrid Professional Theme**: SanBud Blue + HAOS Orange

- **Primary (SanBud Blue)**: `#0A4B6E` - Trust, professionalism, brand identity
- **Accent (HAOS Orange)**: `#FF8C42` - Energy, call-to-actions, highlights
- **Secondary (Light Blue)**: `#2C87B8` - Sections, variety
- **Gradients**: Mixed blue-to-orange for visual interest

### Brand Identity
- **Company**: SanBud Hydraulika
- **Tagline**: "Hydraulika naszą pasją" (Plumbing is our passion)
- **Slogan**: "Fachowość • Rzetelność • Terminowość"
- **Established**: 2018
- **Logo**: Blue hexagonal badge with plumber and tools

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **i18n**: next-intl (Polish primary, English secondary)
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📦 Installation

```bash
cd frontend
npm install
```

## 🛠️ Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌍 Languages

- **Default**: Polish (`pl`)
- **Available**: English (`en`)
- **Switching**: Automatic detection with manual override

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes (proxy to Flask)
│   └── globals.css        # Global styles + design system
├── components/            # React components
│   ├── common/           # Reusable components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── lib/                  # Utilities
│   ├── api.ts           # API client
│   └── utils.ts         # Helper functions
├── messages/            # Translations
│   ├── pl.json         # Polish
│   └── en.json         # English
├── public/             # Static assets
│   └── images/        # Images, logo
└── types/             # TypeScript types
```

## 🎯 Key Features

### Professional Design
- Blue-orange gradient heroes
- Smooth animations (fade, slide, scale)
- Professional shadows and hover effects
- HAOS-level polish and attention to detail

### Responsive Layout
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl
- Touch-friendly interactions

### Performance
- Server-side rendering
- Image optimization
- Code splitting
- React Query caching

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states

## 🔌 API Integration

Backend: Flask API running on `http://localhost:5002`

Endpoints:
- `GET /services/api` - List services
- `POST /appointments/api` - Create appointment
- `GET /appointments/api` - List appointments

## 🎨 Custom Components

### Buttons
- `.btn-primary` - Blue button (main actions)
- `.btn-accent` - Orange button (CTAs)
- `.btn-outline-*` - Outlined variants

### Cards
- `.card` - Standard card
- `.card-primary` - Blue accent border
- `.card-accent` - Orange accent border
- `.feature-card` - Feature with icon
- `.service-card` - Service listing

### Forms
- `.form-input` - Input fields
- `.form-label` - Labels
- `.form-error` - Error messages

### Sections
- `.hero-section` - Blue gradient hero
- `.section-header` - Centered section titles
- `.process-step` - Numbered process steps

## 📱 Pages

1. **Home** (`/`)
   - Hero with CTA
   - Benefits (6 cards)
   - Featured services
   - Process steps
   - Stats
   - Contact form

2. **Services** (`/uslugi` or `/services`)
   - Service grid
   - Search & filters
   - Sorting options
   - Dynamic loading

3. **Booking** (`/umow-wizyte` or `/book`)
   - Personal info form
   - Service selection
   - Date/time picker
   - Validation
   - API submission

4. **About** (`/o-nas` or `/about`)
   - Company info
   - Team
   - Values

5. **Contact** (`/kontakt` or `/contact`)
   - Contact form
   - Map
   - Business hours

## 🚀 Deployment

```bash
npm run build
npm run start
```

Deploy to:
- **Vercel** (recommended for Next.js)
- **Azure Static Web Apps**
- **Azure App Service**

## 🔧 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5002
NEXT_PUBLIC_DEFAULT_LOCALE=pl
```

## 📄 License

© SanBud Hydraulika 2025. All rights reserved.
