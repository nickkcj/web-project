import { Request, Response } from 'express';
import passport from '../config/passport';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err: any, data: any) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication failed' });
    }

    const { user, token } = data;
    const { password, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  })(req, res);
}; 