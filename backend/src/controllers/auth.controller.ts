import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { AppError } from '../middleware/error.middleware';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, data: any) => {
    if (err) {
      return next(new AppError('Google authentication failed', 500));
    }

    if (!data) {
      return next(new AppError('Authentication failed: no user data returned', 401));
    }

    try {
      const { user, token } = data;
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      return next(new AppError('Error processing authentication data', 500));
    }
  })(req, res, next);
};