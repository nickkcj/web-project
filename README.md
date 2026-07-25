<div align="center">

# AbsoluteCinema

#### A Letterboxd-style social platform for movie lovers: log what you watch, rate it, review it and follow friends.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)

**[Live Demo](https://web-project-six-ashen.vercel.app/)**

</div>

---

## Overview

AbsoluteCinema is a social platform for people who love movies, inspired by Letterboxd. Users keep a diary of what they watch, rate and review films, and follow friends to see their activity in a social feed. Movie data comes from the **TMDB API**.

Full-stack TypeScript project built as a college group assignment, with a clean separation between an Express API and a React frontend.

## Features

| Feature | Description |
|---------|-------------|
| Movie diary | Log watched films and write reviews |
| Ratings and reviews | Score films from 0 to 5 stars and share opinions |
| Social feed | Follow other users and see their activity |
| Likes and comments | Interact with reviews across the community |
| Favorites | Keep a personal list of favorite films |
| User profile | Stats and favorites per user |
| Genres and tags | Filter and organize movies by category |

## Architecture

Monorepo with two independent apps:

| App | Stack |
|-----|-------|
| `backend/` | Express + TypeScript, Prisma ORM over PostgreSQL, Passport (Google OAuth) and JWT for auth, express-validator for validation, axios for the TMDB integration |
| `frontend/` | React + TypeScript, Redux Toolkit for state, MUI and Tailwind for UI, react-hook-form + Zod for forms, Framer Motion for animations |

## Tech Stack

- **Frontend:** React, TypeScript, Redux Toolkit, MUI, Tailwind, React Router
- **Backend:** Express, TypeScript, Prisma, PostgreSQL
- **Auth:** Passport (Google OAuth) and JWT
- **External API:** TMDB

## Running Locally

```bash
git clone https://github.com/nickkcj/absolute-cinema.git
cd absolute-cinema

# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

Set the environment variables (database URL, TMDB key, OAuth and JWT secrets) before running the backend.

---

<div align="center">

College group project<br>
Nicholas Jasper, Nicholas Derham, Nícolas Cunha, Felipe Vieira and Iris Souza

</div>
