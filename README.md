# Pataflafla.io | eCommerce

> **Building software is one expression of my curiosity.**

I've always been fascinated by how things work and how they can be improved.

This project is a complete eCommerce application built from scratch.  
Rather than trying to showcase every framework or library I've learned over the years, this repository reflects something I consider far more valuable: ****how I approach software engineering.****

I enjoy building systems that are easy to understand, pleasant to maintain, and pragmatic enough to evolve over time.

The goal wasn't simply to make an online store work, it was to build a project that another developer could clone months later, understand quickly, and feel comfortable extending.

Along the way, I found myself doing what software engineering often requires beyond the "happy path": reading official documentation, investigating GitHub issues, dealing with version differences, and solving problems that only appear once a project starts behaving like a real application.

Those moments became the most valuable part of the journey.

## Features

- Product catalog
- Product details
- Shopping cart
- Authentication
- Role-based authorization
- Checkout flow
- Order management
- Admin dashboard
- Database persistence
- Responsive interface

> **Features may evolve as the project continues to grow.**

## Tech Stack

- Next.js
- Prisma
- PostgreSQL
- NextAuth
- Zod
- Tailwind CSS

## Engineering Notes

This repository intentionally keeps a relatively simple architecture while following practices that make the project easier to understand and maintain.

Some of the principles behind it include:

- Separation of concerns
- Reusable UI components
- Type safety
- Clear Server/Client boundaries
- Input validation
- Maintainable folder structure
- Consistent naming
- Documentation where it adds value

I believe building software is often less about writing code and more about understanding ****why**** things behave the way they do.

## Lessons Learned

Some takeaways from building this project:

- Tutorials are an excellent starting point, but real learning begins when they stop working.
- Reading the official documentation is often more valuable than searching for another tutorial.
- Small architectural decisions can have a significant long-term impact.
- Understanding the framework is more valuable than memorizing APIs.
- Keeping things simple usually pays off.

## Getting Started

### Requirements

- Docker Desktop
- Node.js
- npm

### Installation

1.  Clone this repository.
2.  Copy _env.template_ file and rename it to _.env_:
    `cp .env.template .env`
3.  Install dependencies:
    `npm install`
4.  Start the database:
    `docker compose up -d`
5.  Run database migrations:
    `npx prisma migrate dev`
6.  Seed the database:
    `npm run seed`
7.  Start the development server:
    `npm run dev`

## Roadmap

Some ideas I'd like to continue working on:

- Payment expiration workflow
- Store notification emails
- Email verification
- Two-factor authentication (BetterAuth)
- Improve error handling and messaging
- Multi-language support
- Additional payment providers (Stripe, Mercado Pago, etc.)
- Theme improvements and UI polish

## Feedback & Contributions

No software is ever truly finished, and this project is no exception.

There are probably edge cases I haven't encountered yet, implementation details that could be improved, or architectural decisions worth revisiting.

If you find a bug, notice something that could be cleaner, or simply have an idea to improve the project.  
I'd genuinely appreciate hearing from you.

Feel free to:

- Open an Issue
- Start a Discussion
- Submit a Pull Request

Software improves through collaboration, not perfection.  
If we can make this project better together, even better ♥️

## Final Thoughts

This repository represents more than a working eCommerce application, it reflects how I like to build software: with curiosity, attention to detail, maintainability, and the understanding that every project is an opportunity to keep learning.

Thanks for stopping by 🙏🏼
