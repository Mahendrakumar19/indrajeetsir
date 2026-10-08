import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name?: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'indrajeet_sir_upsc_jwt_secret_key_2026';
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(plain: string, hashedOrPlain: string): Promise<boolean> {
    if (!plain || !hashedOrPlain) return false;
    try {
      // First try bcrypt compare
      const isMatch = await bcrypt.compare(plain, hashedOrPlain);
      if (isMatch) return true;
    } catch (_) {
      // Not a bcrypt hash
    }
    // Backward compatibility if password was stored as plain text
    return plain === hashedOrPlain;
  }

  generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '30d',
      issuer: 'indrajeetsir.com',
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'indrajeetsir.com',
      });
      return decoded as JwtPayload;
    } catch {
      return null;
    }
  }

  extractBearerToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      return parts[1];
    }
    return null;
  }
}
