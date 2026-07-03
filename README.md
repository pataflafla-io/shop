# Pataflafla.io | eCommerce

This repository does not aim to showcase every technology I know—after all, those of us who have been in this field for a while know that what is trendy today will be forgotten tomorrow. Instead, it reflects my approach to frontend (and backend) engineering: building maintainable systems, developing accessible interfaces, and making pragmatic technical decisions that allow products to evolve easily.
This shop was created from scratch without AI help.

## Stack used
- Next.js
- Prisma/PostgreSQL
- NextAuth
- Zod
- TailwindCSS

## Getting Started

1. Clone this repository
2. Copy ```.env.template``` and remame it to ```.env``` and change environment variable to yours
3. Install node dependencies:```npm i # or npm install```
4. Run the database: ```docker compose up -d```  (Docker Desktop must be installed)
5. Run Prisma migrate dev: ```npx prisma migrate dev```
6. Run SEED: ```npm run seed```
7. Run the development server: ```npm run dev```