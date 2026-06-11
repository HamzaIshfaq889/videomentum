# VideoMentum

Discover and track the hottest films in theatres with VideoMentum. Built with Next.js, React, and Tailwind CSS.

## Prerequisites

- **Node.js** 18.18+ or 20+ (recommended: 20.x LTS)
- **npm** 9+ (or yarn, pnpm, bun)

To check your Node version:

```bash
node -v
```

If you need to install or switch Node versions, consider using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).

## Tech Stack & Versions

| Package       | Version |
|---------------|---------|
| Next.js       | 16.1.6  |
| React         | 19.2.3  |
| React DOM     | 19.2.3  |
| Tailwind CSS  | ^4      |
| TypeScript    | ^5      |

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd videoMentum
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy the example env file and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# VideoMentum API base URL (used for top in theatres, chat, ticker, etc.)
VIDEOMENTUM_API_BASE_URL=https://videomentum.com/api

# Optional: for metadata
NEXT_PUBLIC_SITE_URL=https://videomentum.com
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start dev server (hot reload)  |
| `npm run build`| Build for production           |
| `npm run start`| Start production server        |
| `npm run lint` | Run ESLint                     |

## Production Build

```bash
npm run build
npm run start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app/` – Next.js App Router pages and layouts
- `src/app/api/` – API routes (ticker, email, top-in-theatres)
- `src/components/` – React components
- `src/lib/` – Shared utilities and API helpers
- `public/` – Static assets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
