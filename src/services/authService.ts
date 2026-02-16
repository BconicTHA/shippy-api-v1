import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { LoginRequest, RegisterRequest, AuthResponse, TokenPayload } from '../types/auth';

const prisma = new PrismaClient();

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || "" ;
  private static readonly JWT_EXPIRES_IN = '1h';
  private static readonly SALT_ROUNDS = 10;

  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { name, username, email, password, password_confirmation , usertype } = data;

    console.log('AuthService.register called with:', { name, username, email });

    // Validate password confirmation
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already exists');
      }
      if (existingUser.username === username) {
        throw new Error('Username already exists');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || username,
        usertype,
        address: '',
        phone: '',
      }
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    // Generate access token
    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      usertype: user.usertype,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        usertype: user.usertype,
        address: user.address,
        phone: user.phone,
      },
      access_token: accessToken,
    };
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data;

    console.log('AuthService.login called with email:', email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    console.log('Login successful for user:', user.email);

    // Generate access token
    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      usertype: user.usertype,
      address: user.address,
      phone: user.phone,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        usertype: user.usertype,
        address: user.address,
        phone: user.phone,
      },
      access_token: accessToken,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(token: string): Promise<{ access_token: string }> {
    try {
      // Verify the current token
      const decoded = jwt.verify(token, this.JWT_SECRET) as unknown as TokenPayload;

      console.log('Token refresh for user:', decoded.email);

      // Generate new access token
      const newAccessToken = this.generateAccessToken({
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        name: decoded.name,
        usertype: decoded.usertype,
      });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Logout user (token invalidation would be handled by client or a token blacklist)
   */
  static async logout(token: string): Promise<void> {
    // Verify token is valid
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      console.log('User logged out:', decoded.email);
      // In a production app, you might want to add the token to a blacklist
      // or store invalidated tokens in Redis/database
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT access token
   */
  private static generateAccessToken(payload: {
    id: string;
    email: string;
    username: string;
    name: string;
    usertype: string;
    address?: string;
    phone?: string;
  }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }
}