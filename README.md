# Umair Nadeem - Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Inspired by Brittany Chiang's design, this website showcases Umair Nadeem's experience as a Software Quality Assurance Engineer.

## Features

- 🎨 Modern, clean design with smooth animations
- 📱 Fully responsive across all devices
- ⚡ Fast performance with Next.js
- 🎯 SEO optimized
- 🌙 Dark theme with custom color scheme
- ✨ Smooth scrolling navigation
- 📧 Contact form and social links

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP, with ScrollTrigger, ScrollSmoother, and SplitText
- **3D**: Three.js (lazy-loaded, isolated to the Hero section)
- **Icons**: Lucide React
- **Fonts**: Bricolage Grotesque, Satoshi, and JetBrains Mono

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd umair-nadeem-portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── public/
│   └── umair-nadeem-qa-engineer-resume.pdf   # public resume ("Download resume")
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
- Primary: `#64ffda` (Cyan)
- Dark: `#0a192f` (Navy)
- Light: `#ccd6f6` (Light Blue)
- Slate: `#8892b0` (Gray)

### Content
Update the content in each component file to match your information:
- Personal details in `Hero.tsx`
- About section in `About.tsx`
- Work experience in `Experience.tsx`
- Skills in `Skills.tsx`
- Contact information in `Contact.tsx`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Performance

- Core Web Vitals: Optimized
- Bundle Size: Optimized with Next.js

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Email**: umiiawan06@gmail.com
- **LinkedIn**: [Umair Nadeem](https://www.linkedin.com/in/umair-nadeem-qa/)
- **Upwork**: [Umair Nadeem](https://www.upwork.com/freelancers/~01862b323ce960e4b6)

---

Built with ❤️ by Umair Nadeem 