import { User } from '../models/user';
import bcrypt from 'bcryptjs';

export const resolvers = {
  Query: {
    users: async () => await User.getAll(),
    user: async (_: any, { id }: { id: string }) => await User.findById(parseInt(id)),
  },
  Mutation: {
    register: async (_: any, { email, password, name }: { email: string; password: string; name: string }) => {
      const user = await User.create({ email, password, name });
      const token = User.generateToken(user);
      return { token, user };
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = User.generateToken(user);
      return { token, user };
    },
  },
};