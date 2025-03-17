import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

// Load environment variables
dotenv.config();

// Explicitly type the app as Express
const app: Express = express();
app.use(express.json());

// REST API routes
app.use('/api/users', userRoutes);

// GraphQL setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  // Start Apollo Server`
  await server.start();
  
  // Apply middleware with explicit type casting if needed
  server.applyMiddleware({ app: app as any }); // Type assertion as a temporary workaround
  
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch((error) => console.error('Server failed to start:', error));