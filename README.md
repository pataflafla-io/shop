# eCommerce

## Live Demo

🌐 **Demo:** https://demoshop.pataflafla.io

> Some administrative features are intentionally limited in the public demo to preserve the environment.  
> The complete implementation is available in this repository.

---

## About

This project is a complete eCommerce application built from scratch.

Rather than trying to showcase every framework or library I've learned over the years, this repository reflects something I consider far more valuable: **how I approach software engineering.**

I enjoy building systems that are easy to understand, pleasant to maintain, and pragmatic enough to evolve over time.

The goal wasn't simply to make an online store work. It was to build a project that another developer could clone months later, understand quickly, and feel comfortable extending.

Like many real-world projects, this one eventually moved beyond the tutorial.

Reading official documentation, investigating GitHub issues, dealing with breaking changes, and understanding unexpected behavior became the most valuable part of the journey.

It reinforced something I've experienced throughout my career:

> **The best learning begins when the tutorial runs out of answers.**

---

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

> This project is intentionally treated as an evolving codebase rather than a finished product.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Prisma
- PostgreSQL
- NextAuth
- Zod
- Zustand
- Tailwind CSS

---

## Engineering Principles

This project intentionally favors clarity over cleverness.

Some of the principles behind it include:

- Separation of concerns
- Reusable UI components
- Type safety
- Clear Server/Client boundaries
- Input validation
- Maintainable folder structure
- Consistent naming
- Documentation where it adds value

I believe software engineering is often less about writing code and more about understanding why things behave the way they do.

---

## Lessons Learned

Some takeaways from building this project:

- Tutorials are an excellent starting point, but real learning begins when they stop working.
- Reading the official documentation is often more valuable than searching for another tutorial.
- Small architectural decisions can have a significant long-term impact.
- Understanding the framework is more valuable than memorizing APIs.
- Keeping things simple usually pays off.

---

## Getting Started

### Requirements

- Docker Desktop
- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/your-user/your-repository.git
```

Move into the project:

```bash
cd your-repository
```

Create the environment file:

```bash
cp .env.template .env
```

Install dependencies:

```bash
npm install
```

Start the database:

```bash
docker compose up -d
```

Run the migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

---

## Roadmap

Planned improvements include:

- User Profile
- User management improvements
- Navigation and UI polish
- Payment confirmation emails
- Payment expiration workflow
- Additional payment providers (Stripe, Mercado Pago, etc.)
- Email verification
- Two-factor authentication (BetterAuth)
- Improved error handling and messaging
- Multi-language support

---

## Feedback & Contributions

No software is ever truly finished, and this project is no exception.

There are probably edge cases I haven't encountered yet, implementation details that could be improved, and architectural decisions worth discussing.

If you find a bug, notice something that could be cleaner, or simply have an idea to improve the project, I'd genuinely appreciate hearing from you.

Feel free to:

- Open an Issue
- Start a Discussion
- Submit a Pull Request

> **Software improves through collaboration, not perfection.**

If we can make this project better together, even better. ❤️

---

## Final Thoughts

This repository is more than a working eCommerce application.

It's a snapshot of how I enjoy building software: with curiosity, attention to detail, maintainability, and the belief that understanding a system will always be more valuable than memorizing a tool.

Thanks for stopping by. 🙏🏼
