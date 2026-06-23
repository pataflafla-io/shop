## Getting Started

1. Clone this repository
2. Copy ```.env.template``` and remame it to ```.env``` and change environment variable to yours
3. Install node dependencies:```npm i # or npm install```
4. Run the database: ```docker compose up -d```
5. Run Prisma migrate dev: ```npx prisma migrate dev```
6. Run SEED: ```npm run seed```
7. Run the development server: ```npm run dev```