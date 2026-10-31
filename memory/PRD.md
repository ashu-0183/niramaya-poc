# Niramaya Physiotherapy — Landing Page PRD

## Original problem statement
Build a landing page: Build a complete, responsive single-page static website for 'Niramaya Physiotherapy' using modern HTML5, Tailwind CSS, and JavaScript.

Design & Theme:
- Brand colors: Primary Teal (#0b6b7b) for headers, navigation, and primary CTAs; Accent Leaf Green (#49b646) for buttons, badges, and highlights.
- Professional, clean medical aesthetic featuring the dual-text branding ("Niramaya Physiotherapy / निरामया:").

Key Sections & Features to Include:
1. Navigation Bar & Language Switcher: Logo placeholder, links to Home, About Us, Services, Conditions Treated, Testimonials, and Contact. A functional Language Switcher dropdown for English, Hindi (हिंदी), and Marathi (मराठी).
2. Hero Section: Compelling headline ("Your Path to Natural Healing"), subtext, and a "Book a Consultation" call-to-action button.
3. Key Services Grid (all 11 services required): Sports Injury Rehabilitation, Back Pain Treatment, Neck Pain Treatment, Arthritis Management, Post-Surgery Rehab, Neurological Physiotherapy, Pediatric Physiotherapy, Geriatric Physiotherapy, Dry Needling, Manual Therapy, and Electrotherapy.
4. Physiotherapist Profile Section: Professional photo placeholder, qualifications, experience, registration details, and awards.
5. Testimonials Section: Patient reviews, star ratings, and video testimonial placeholders.
6. Contact & Location Section: Enquiry form (Name, Phone, Service, Message) and embedded Google Maps mockup with directions.
7. Floating WhatsApp Button: Fixed bottom-right chat widget with pre-filled message support ("Hi, I want to book an appointment").

Make the code clean, modular, and ready for a static deployment.

User choices: enquiry form opens WhatsApp with details pre-filled; whole page translated (EN/HI/MR); clinic: Shop No 34, R10 Commercial, Life Republic Rd, Jambe, Maharashtra 411057; phone & WhatsApp 7666003113. User logo provided (used as-is).

## Architecture
- Frontend only (React CRA + Tailwind + shadcn/ui + framer-motion + lenis) — builds to static files. No backend calls.
- i18n: `src/i18n/{en,hi,mr}.js` + `LanguageProvider` (localStorage, sets `<html lang>`).
- Site constants: `src/lib/site.js` (phone, WhatsApp, address, map links, images). Smooth scroll: `src/lib/smooth.js`.
- Components: `src/components/site/*` (Navbar, LanguageSwitcher, MobileMenu, Hero, RotatingBadge, Marquee, About, Services, ServiceCard, Conditions, Profile, Testimonials, Contact, EnquiryForm, Footer, WhatsAppButton).
- Assets saved locally in `public/assets/` (logo, logo mark, Unsplash photos). Favicons from logo mark.
- SEO: title, description, OG/Twitter, JSON-LD (Physiotherapy), noscript, robots.txt, llms.txt.

## User personas
- Local patients (Life Republic / Hinjewadi area) searching for pain relief/rehab, on phones, reading EN/HI/MR.
- Family members booking for seniors/children.

## Core requirements (static)
- 6 nav sections + language switcher; hero with Book CTA; 11 services; conditions; profile; testimonials + video placeholders; contact form → WhatsApp; map + directions; floating WhatsApp.

## Implemented (2026-10-31)
- Full single-page site with kinetic masked hero, 3D tilt + parallax photo, rotating badge, slow marquee, bento services grid (11 + WhatsApp tile), interactive conditions selector, profile with placeholders, featured review layout, video placeholder dialog, contact with Google Maps embed, footer.
- Language switch EN/HI/MR across the whole page (persisted).
- Enquiry form validation + WhatsApp prefill; "Book this" on a service pre-selects it in the form.
- Verified at 1440px and 390px; form flow and WhatsApp links verified.

## Placeholders to replace
- Physiotherapist name, photo, quote, qualifications, years of experience, registration no., awards.
- Clinic hours.
- Testimonials (sample reviews, patient names) and video testimonials.

## Backlog
- P1: Replace placeholders with real details/photos; real patient videos.
- P1: Add sitemap/canonical/og:image once the live domain is known.
- P2: Google reviews widget, blog/exercise tips, opening-hours schema.
