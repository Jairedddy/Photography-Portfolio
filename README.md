# Photography Portfolio

A modern, minimalist photography portfolio application built with React, TypeScript, and Vite. Features a dual-theme system (Monochrome/Vibrant), smooth animations, and a fully functional contact form with email integration.

## ✨ Features

- 🎨 **Dual Theme System** - Seamlessly switch between Monochrome and Vibrant color themes
- 📸 **Dynamic Gallery** - Masonry grid layout with pagination and smooth parallax effects
- 📝 **Contact Form** - Fully functional contact form with Vercel serverless backend
- 🎯 **Custom Cursor** - Interactive custom cursor implementation
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Performance** - Built with Vite for lightning-fast development and production builds
- 🎬 **Smooth Animations** - Framer Motion powered transitions and scroll effects
- 🖼️ **Horizontal Scroll Carousel** - Unique horizontal scrolling gallery experience

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd v1
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the root directory (`v1/.env`) based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your SMTP credentials:
   ```env
   SMTP_HOST=your-smtp-host.com
   SMTP_PORT=465
   SMTP_USER=your-email@example.com
   SMTP_PASS=your-smtp-password
   TO_ADDRESS=jaishukreddy7@gmail.com
   
   # Optional: Custom API endpoint
   VITE_CONTACT_ENDPOINT=/api/contact
   
   # Optional: Allowed CORS origins (comma-separated)
   CLIENT_ORIGIN=http://localhost:3000,https://yourdomain.com
   ```

   > **Note:** The contact form requires valid SMTP credentials to send emails. You can use services like Gmail, SendGrid, or any SMTP provider.

### Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

2. **For full-stack development** (with API endpoints):
   
   If you have Vercel CLI installed, you can run the full application with serverless functions:
   ```bash
   npx vercel dev
   ```
   
   This will start both the frontend and API endpoints, allowing you to test the contact form functionality locally.

### Building for Production

1. **Build the application**:
   ```bash
   npm run build
   ```
   
   This creates an optimized production build in the `dist/` directory.

2. **Preview the production build**:
   ```bash
   npm run preview
   ```

3. **Deploy to Vercel**:
   
   The application is configured for Vercel deployment. Make sure to:
   - Add all environment variables in your Vercel project settings
   - The API endpoint (`/api/contact`) will be automatically available at `/api/contact`

## 📁 Project Structure

```
v1/
├── api/
│   └── contact.ts              # Vercel serverless function for contact form
├── src/
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── Footer.tsx         # Footer component
│   │   ├── HeroWorks.tsx      # Main gallery component
│   │   ├── HorizontalScrollCarousel.tsx
│   │   ├── Navbar.tsx         # Navigation bar
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   └── HomePage.tsx
│   ├── utils/                 # Utility functions
│   ├── App.tsx                # Main app component
│   ├── main.tsx               # Application entry point
│   ├── main.css               # Global styles
│   └── types.ts               # TypeScript type definitions
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## 🛠️ Technologies

- **Vite** - Next-generation frontend build tool
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lenis** - Smooth scrolling library
- **Three.js** - 3D graphics (via React Three Fiber)
- **Nodemailer** - Email sending (serverless function)
- **Vercel** - Deployment platform with serverless functions

## 📧 Contact Form Setup

The contact form uses a Vercel serverless function located at `api/contact.ts`. To enable email functionality:

1. **Configure SMTP settings** in your `.env` file
2. **Deploy to Vercel** or run `npx vercel dev` locally
3. **Add environment variables** in Vercel dashboard (if deploying)

The API endpoint accepts POST requests to `/api/contact` with the following payload:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in..."
}
```

## 🎨 Theme System

The application features two distinct themes:

- **Monochrome Theme** - Black and white aesthetic with grayscale images
- **Vibrant Theme** - Colorful design with gradient accents (purple to teal)

Users can toggle between themes using the theme switcher in the navigation bar.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npx vercel dev` - Run with Vercel serverless functions (requires Vercel CLI)

## 🔧 Configuration

### Vite Configuration

The project uses Vite with React plugin. Configuration can be found in `vite.config.ts`.

### Tailwind Configuration

Tailwind CSS is configured in `tailwind.config.js` with custom theme settings.

### TypeScript Configuration

TypeScript settings are defined in `tsconfig.json` and `tsconfig.node.json`.

## 📄 License

This project is private and proprietary.

## 👤 Author

Jai Reddy - Photography Portfolio

---

For questions or support, please contact: jaishukreddy7@gmail.com
