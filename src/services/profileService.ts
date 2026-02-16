import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProfileService {
  /**
   * Get user profile
   */
  static async getProfile(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          phone: true,
          address: true,
          usertype: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile (name, phone, address)
   */
  static async updateProfile(
    userId: string, 
    data: { name?: string; phone?: string; address?: string }
  ) {
    try {
      const updateData: any = {};

      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      if (data.phone !== undefined) {
        updateData.phone = data.phone;
      }
      if (data.address !== undefined) {
        updateData.address = data.address;
      }

      updateData.updatedAt = new Date();

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          phone: true,
          address: true,
          usertype: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
}