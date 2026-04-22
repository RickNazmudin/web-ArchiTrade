# ArchiTrade Web - Panduan AI Copilot

## Gambaran Proyek

ArchiTrade adalah platform komunitas trading berbasis **Next.js 16** dengan autentikasi dual-role (dashboard pengguna/admin). Dibangun dengan TypeScript, Supabase (auth + database), Tailwind CSS, dan Framer Motion untuk animasi.

## Pola Arsitektur

### Kontrol Akses Berbasis Role (RBAC)

- **Routing Middleware** (lihat [middleware.ts](../middleware.ts)): Memberlakukan pengalihan role di tingkat request
  - Admin mengakses `/dashboard` → dialihkan ke `/admin/dashboard`
  - User mengakses `/admin/*` → diblokir
  - Tabel profiles memiliki field `role` (admin/user)
- **Pola**: Query tabel `profiles` Supabase berdasarkan `user.id` untuk menentukan role saat eksekusi middleware

### Struktur Direktori & Route Groups

- **(auth)** group: Halaman login/register—route publik
- **(dashboard)** group: Halaman menghadap pengguna (daily-outlook, invoices, notifications, settings, subscription, support)
- **admin** group: Halaman admin saja (users, mt5, subscriptions management)
- **app/\_components**: Komponen spesifik halaman (footer, marquee, video-card, world-map-demo)
- **components/ui**: Komponen UI yang dapat digunakan kembali dengan CVA (Class Variance Authority) untuk varian
- **lib/supabase/client.ts**: Factory Supabase client sisi browser—gunakan untuk client components

### Client vs Server Components

- Gunakan **"use client"** untuk fitur interaktif: animasi, modal, state form
- Dynamic imports dengan `ssr: false` untuk komponen animasi berat (lihat [client-wrapper.tsx](../app/_components/client-wrapper.tsx))
- Middleware menangani auth state; server components dapat menganggap konteks user via request headers

### Sistem Komponen UI

- Dibangun dengan primitif **Radix UI** + **CVA** untuk varian
- Import dari `@/components/ui` (alias path dikonfigurasi)
- Contoh: [button.tsx](../components/ui/button.tsx) dengan varian (default, outline, ghost, destructive)
- Gunakan utility `cn()` dari `@/lib/utils` untuk menggabungkan kelas Tailwind dengan `clsx + tailwind-merge`

## Dependensi & Integrasi Kritis

### Supabase

- **Auth**: Server client di middleware; browser client di components
- **Database**: Tabel profiles (`id`, `role`, ...field lainnya)
- **Environment**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Pola**: Buat middleware Supabase client untuk membaca auth state + role profile

### Styling & Animasi

- **Tailwind CSS** dengan dark mode (dikodekan di [layout.tsx](../app/layout.tsx): `<html className="dark">`)
- **Grain effect**: overlay `grains.css` di root layout
- **Animasi**: Framer Motion, Embla Carousel, custom animated components (AnimatedBeam, AnimatedList, dll)
- **Font**: Geist via `next/font/google`; Inter sans-serif

### CDN Gambar Eksternal

- **Cloudinary**, **Unsplash**, **Vercel Avatar** dikonfigurasi di [next.config.mjs](../next.config.mjs)—pola remote yang diizinkan

## Alur Kerja Developer

### Mulai Development

```bash
npm run dev  # Berjalan di http://localhost:3000
```

### Build & Deployment

```bash
npm run build   # Build Next.js
npm run start   # Mulai production
npm run lint    # Validasi ESLint
```

### Perintah Utama

- Dev rebuild: Auto-reload saat perubahan file (Next.js fast refresh)
- Test lokal: Browser manual + cek console untuk log middleware

## Konvensi Spesifik Proyek

### Naming & Imports

- **Path alias**: `@/*` peta ke root (misal `@/lib/utils`, `@/components/ui`)
- **File komponen**: `.tsx` untuk React components, `.ts` untuk utilities
- **Tidak ada barrel exports** di `ui/`—import langsung dari file spesifik

### Middleware & Auth

- Middleware log di setiap route guard: `"Middleware - Path:", pathname`
- Role check query `profiles.role` dan redirect jika tidak cocok
- Konfigurasi matcher menentukan route terlindungi—tambahkan route terlindungi baru ke array `matcher`

### Reusable Functions

- `cn()` from `@/lib/utils`—always used for Tailwind class merging
- `bcryptjs` for password hashing (already in dependencies)
- Date formatting via `date-fns`

### Styling Patterns

- **Dark mode first**: Entire app is dark theme (no light mode toggle yet)
- **Tailwind animations**: via `tailwindcss-animate` plugin
- **Granular components**: Small, composable UI pieces in `components/ui/`

## Tugas Umum

### Menambah Route Terlindungi

1. Tambahkan halaman di `app/(dashboard)/[feature]/page.tsx` atau `app/admin/[feature]/page.tsx`
2. Jika route admin baru, tambahkan ke array `matcher` middleware di [middleware.ts](../middleware.ts)
3. Import Supabase client di halaman; gunakan dalam `useEffect` atau server functions

### Membuat Komponen UI Baru

1. Buat file di `components/ui/component-name.tsx`
2. Gunakan CVA untuk varian; export dengan interface prop
3. Gunakan `cn()` untuk penggabungan kelas
4. Contoh pola: [button.tsx](../components/ui/button.tsx)

### Menambah Animasi

1. Import Framer Motion: `import { motion } from "framer-motion"`
2. Gunakan directive `"use client"`
3. Untuk komponen berat, pertimbangkan dynamic import dengan `ssr: false` di [client-wrapper.tsx](../app/_components/client-wrapper.tsx)

### Integrasi Database

1. Sisi server: Buat Supabase client di middleware atau API routes
2. Sisi client: Gunakan browser client dari `@/lib/supabase/client.ts` dengan `useEffect`
3. Selalu periksa role user via tabel profiles sebelum operasi sensitif

## Konfigurasi TypeScript

- **Strict mode enabled**: Type semua function dan props
- **Paths dikonfigurasi**: `@/*` → direktori root
- **Type roots**: Termasuk `./types/` untuk file `.d.ts` custom (misal Embla Carousel)
- **JSX mode**: react-jsx (automatic)

## Testing & Debugging

- Console logs di middleware menunjukkan keputusan routing
- Periksa tab network browser DevTools untuk request Supabase auth
- Gunakan `next lint` untuk menangkap error TypeScript/ESLint sebelum commit
- Sonner toasts untuk feedback pengguna (dikonfigurasi dengan styling dark theme)
