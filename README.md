# Ecommerce Backend Used command
mkdir ecommerce-backend
cd ecommerce-backend
npm init -y
npm install typescript ts-node @types/node --save-dev
npm install express @types/express apollo-server-express graphql prisma @prisma/client jsonwebtoken bcryptjs
npx tsc --init

# Commands

# Initialize Prisma
npx prisma init
npx prisma migrate dev --name init

# Update package.json scripts
# Add these to the "scripts" section:
"scripts": {
  "start": "ts-node src/server.ts",
  "build": "tsc",
  "dev": "ts-node-dev src/server.ts"
}

# Install ts-node-dev for development
npm install ts-node-dev --save-dev

# Start the server
npm run dev