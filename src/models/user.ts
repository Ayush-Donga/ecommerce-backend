import { prisma } from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class User {
  static async create(data: { email: string; password: string; name: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async getAll() {
    return prisma.user.findMany();
  }

  static async update(id: number, data: { name?: string; password?: string }) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    
    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  static generateToken(user: { id: number; role: string }) {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }
}