# Pataflafla.io | eCommerce

I've always been fascinated by how things work and how they can be improved.

Building software is one expression of that curiosity.

This project is a complete eCommerce application built from scratch. It wasn't created to showcase every framework or library I've learned over the years—those change constantly. Instead, it reflects the way I like to build software: keeping systems maintainable, interfaces accessible, and solutions pragmatic enough to evolve over time.

My goal wasn't simply to make an online store work. I wanted to build something that another developer could pick up months later and still enjoy working on.

## Stack

* Next.js
* Prisma
* PostgreSQL
* NextAuth
* Zod
* Tailwind CSS

## Getting Started

1. Clone this repository.
2. Copy `.env.template` to `.env` and configure the environment variables.
3. Install dependencies:
   ```bash npm install ```
4. Start the database:
   ```bash docker compose up -d```
5. Run the database migrations:
   ```bash npx prisma migrate dev```
6. Seed the database:
   ```bash npm run seed```
7. Start the development server:
   ```bash npm run dev```


### Requirements

* Docker Desktop