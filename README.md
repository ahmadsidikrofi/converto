<div align="center">
  <img src="public/Converto-logo.png" alt="Converto Logo" width="80" />
  <h1>Converto</h1>
  <p><strong>Infinite Free File Converter — Convert images, audio, and video with no limits.</strong></p>

  <p>
    <a href="https://converto-bay.vercel.app/">🌐 Live Demo</a> ·
    <a href="https://github.com/ahmadsidikrofi/converto/issues">🐛 Report Bug</a> ·
    <a href="https://github.com/ahmadsidikrofi/converto/issues">✨ Request Feature</a>
  </p>

  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel" alt="Vercel" />
</div>

---

## 📖 About Converto

**Converto** is a free, unlimited, and login-free online multimedia file converter. Built by **Ahmad Sidik Rofiudin**, Converto lets anyone convert image, audio, and video files directly in the browser — no installation required, no cost, and no file limits.

---

## ✨ Features

### 🖼️ Image Conversion
- Convert between image formats (JPEG, PNG, WEBP, and more)
- Resize, crop, and rotate images
- Image compression powered by `browser-image-compression`

### 🎵 Audio Transformation
- Convert audio files to various formats (MP3, WAV, AAC, and more)
- Adjust audio bitrate
- Merge multiple audio files into one

### 🎬 Video Metamorphosis
- Transcode videos to various formats
- Trim and merge video clips
- Powered by `@ffmpeg/ffmpeg` running entirely in the browser via WebAssembly

### 🔒 Privacy & Security
- All conversion processes run **client-side** — your files are never uploaded to a server
- No database, no permanent file storage
- Completely safe and private

### 📦 Additional Features
- Download converted files as a ZIP archive using `jszip`
- Export to PDF using `jspdf`
- Signature canvas support via `react-signature-canvas`
- Dark mode with `next-themes`
- Drag & drop file upload with `react-dropzone`
- Fully responsive — works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) |
| UI Library | [React 18](https://react.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix UI) |
| Video/Audio Processing | [@ffmpeg/ffmpeg](https://ffmpegwasm.netlify.app/) (WebAssembly) |
| Image Processing | [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) |
| Form Handling | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| File Archiving | [JSZip](https://stuk.github.io/jszip/) |
| PDF Generation | [jsPDF](https://github.com/parallax/jsPDF) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) + [Radix Icons](https://www.radix-ui.com/icons) |
| Deployment | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm / yarn / pnpm / bun

### Installation

1. **Clone this repository**

```bash
git clone https://github.com/ahmadsidikrofi/converto.git
cd converto
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in your browser**

```
http://localhost:3000
```

---

## 📁 Project Structure

```
converto/
├── public/           # Static assets (images, icons, etc.)
├── src/              # Main source code (pages, components, etc.)
├── utils/            # Helper functions & utilities
├── next.config.mjs   # Next.js configuration
├── tailwind.config.js
├── components.json   # shadcn/ui configuration
└── package.json
```

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. The easiest way to deploy your own version:

1. Push your code to a GitHub repository
2. Connect the repo to [Vercel](https://vercel.com/)
3. Vercel will automatically build and deploy on every push to the `master` branch

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'feat: add some feature'`)
4. Push to the branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Ahmad Sidik Rofiudin**

- GitHub: [@ahmadsidikrofi](https://github.com/ahmadsidikrofi)
- Live App: [converto-bay.vercel.app](https://converto-bay.vercel.app/)

---

<div align="center">
  <p>Made with ❤️ by Ahmad Sidik Rofiudin</p>
</div>
