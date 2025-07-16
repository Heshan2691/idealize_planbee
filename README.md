# Idealize PlanBee

A modern Next.js application with both frontend and backend capabilities, built with TypeScript, Tailwind CSS, and modern development practices.

## Features

- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for modern, responsive styling
- **API Routes** for backend functionality
- **ESLint** and **TypeScript** configuration
- **Modern component architecture** with reusable components

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes (backend)
│   │   ├── hello/      # Hello API endpoint
│   │   └── health/     # Health check endpoint
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # Reusable UI components
│   ├── Button.tsx      # Button component
│   ├── Loading.tsx     # Loading spinner
│   └── index.ts        # Component exports
├── lib/                # Utility functions and configurations
│   ├── api.ts          # API client
│   └── utils.ts        # Utility functions
└── types/              # TypeScript type definitions
    └── index.ts        # Shared types
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd idealize_planbee
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Endpoints

The application includes several API endpoints:

- `GET /api/hello` - Hello world endpoint
- `POST /api/hello` - Hello world with data
- `GET /api/health` - Health check endpoint

## Development

### Adding New Components

Create new components in the `src/components` directory and export them from `src/components/index.ts`.

### Adding New API Routes

Create new API routes in the `src/app/api` directory. Each route should be in its own folder with a `route.ts` file.

### Styling

This project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.