import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export function generateValidToken(user: User) {
  const jwtService = new JwtService();
  const { id, email } = user;

  const token = jwtService.sign(
    { email },
    {
      expiresIn: '7 days',
      issuer: 'Caio',
      subject: String(id),
      audience: 'users',
      secret: process.env.JWT_SECRET,
    },
  );

  return token;
}
