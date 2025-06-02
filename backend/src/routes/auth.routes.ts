import { Router } from 'express';
import { googleAuth, googleCallback } from '../controllers/auth.controller';
import passport from '../config/passport';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

router.get('/test', passport.authenticate('google', { session: false }), (req, res) => {
  res.json({ message: 'Autenticado com sucesso!', user: req.user });
});

export default router; 