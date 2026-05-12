# Diskord: A Full-Stack Discord Clone ©️

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Stream Chat](https://img.shields.io/badge/Stream_Chat-SDK-blue?style=for-the-badge) ![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge)

This project is my effort in recreating one of the most popular communication platforms in the world. Diskord has all the core features of Discord: text messaging, voice and video communication, channel and server creation, screen sharing, and more. Building this project has been a hands-on journey into mastering Next.js and modern full-stack web development.

## ✨ Core Features

* **Real-time Messaging:** Lightning-fast text chat powered by Stream Chat SDK.
* **Server & Channel Creation:** Users can seamlessly create custom servers and organize conversations into distinct text/voice channels.
* **Voice & Video Rooms:** Real-time voice and video communication (including screen sharing).
* **Secure Authentication:** Safe and robust user login and registration handled by Clerk.
* **Rich Media & Emoji Support:** Custom message composer integrated with Emoji Mart for a rich user experience.

## 💻 Tech Stack

Built with modern web technologies, this project leverages a powerful ecosystem of tools:

* **[Next.js (App Router)](https://nextjs.org/)**: Core framework and server-side rendering architecture.
* **[Stream Chat SDK](https://getstream.io/)**: Real-time messaging, voice, and video infrastructure.
* **[Clerk](https://clerk.com/)**: Secure and seamless user authentication.
* **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI styling.

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:
* Node.js
* npm or yarn

### Environment Variables

Before running the project, you need to configure your environment variables. Create a `.env.local` file in the root directory and add your API keys:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stream Chat SDK Keys
NEXT_PUBLIC_STREAM_KEY=your_stream_api_key
STREAM_SECRET=your_stream_api_secret

<!-- First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!