# Jade & Co - Luxury Real Estate Website

A modern, responsive landing website for luxury real estate, built with Next.js, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Next.js 16.1.6** (App Router)
- **React 19.2.4**
- **TypeScript 5.9.3**
- **Tailwind CSS 4.1.18** (v4 with CSS-first configuration)
- **Framer Motion 12.30.1**
- **Static JSON data**

## Features

- ✅ Sticky header with "Call Now" button (Ultravox integration ready)
- ✅ Hero section with luxury styling
- ✅ Property listings grid (4 rows × 3 columns = 12 properties)
- ✅ Property cards with hover overlay animations
- ✅ Property detail pages with image galleries
- ✅ Fully responsive design
- ✅ Ultravox voice agent integration placeholders

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Header and Footer
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── properties/
│   │   └── [slug]/
│   │       └── page.tsx     # Property detail page
│   └── not-found.tsx        # 404 page
├── components/
│   ├── Header.tsx           # Sticky header component
│   ├── Hero.tsx             # Hero section
│   ├── PropertyCard.tsx     # Individual property card
│   ├── PropertyGrid.tsx     # Property grid layout
│   ├── Footer.tsx           # Footer component
│   └── SpeakToAgentButton.tsx # CTA button component
└── data/
    └── properties.ts        # Property data (12 entries)
```

## Ultravox Integration Points

The following components have placeholder functions ready for Ultravox integration:

1. **Header** (`components/Header.tsx`): `handleCallNow()` - Inbound call trigger
2. **PropertyCard** (`components/PropertyCard.tsx`): `handleGetCall()` - Outbound call trigger on hover
3. **SpeakToAgentButton** (`components/SpeakToAgentButton.tsx`): `handleSpeakToAgent()` - Agent call trigger

All integration points are clearly commented with:
```typescript
// Ultravox voice agent integration
```

## Customization

- **Properties**: Edit `data/properties.ts` to add or modify property listings
- **Styling**: Modify Tailwind classes in components or update `tailwind.config.ts`
- **Colors**: Update the color scheme in component files or Tailwind config

## License

Private project for Jade & Co.
