import { supabase } from '../utils/supabase.js';

export class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.client.auth.signUp({
        email,
        password
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({
        user: data.user,
        message: 'Registration successful'
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabase.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.json({
        user: data.user,
        session: data.session
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.substring(7);
      
      if (token) {
        await supabase.client.auth.signOut();
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

