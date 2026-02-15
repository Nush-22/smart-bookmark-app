# Smart Bookmark App

A simple real-time bookmark manager built using Next.js 14 (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS.

## 🔗 Live Demo
(Deployed on Vercel)
👉 https://smart-bookmark-app-seven-olive.vercel.app/dashboard

---

## 🚀 Features

- Google OAuth login (Supabase Auth)
- Add bookmarks (Title + URL)
- Delete bookmarks
- Bookmarks are private per user (Row Level Security)
- Real-time updates across multiple tabs
- Clean responsive UI using Tailwind
- Deployed on Vercel

---

## 🛠 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth + Postgres + Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## 🏗 Architecture Overview

- Supabase handles authentication (Google OAuth only)
- Each bookmark row contains a `user_id`
- Row Level Security ensures users can only access their own bookmarks
- Supabase Realtime listens to INSERT and DELETE events
- Next.js App Router manages protected routes

---
## 🔐 Authentication Flow

- User clicks "Sign in with Google"
- Supabase handles OAuth
- Session is created and stored
- Unauthenticated users are redirected to `/login`
- Authenticated users can access `/dashboard`

Only Google login is enabled (no email/password).

---
## 🗄 Database Schema

```sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  url text not null,
  created_at timestamp default now()
);
```
##📦 Local Setup Instructions

1. Clone the repository:
   ```bash

   git clone https://github.com/yourusername/smart-bookmark-app.git
   cd smart-bookmark-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env.local file:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run the development server:
     ```bash
   npm run dev
   ```
