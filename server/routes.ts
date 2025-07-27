import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {

  // User Signup
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user, message: 'Check your email to confirm your account' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  // User Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  // Get Current User
  app.get('/api/auth/user', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const { data, error } = await supabase.auth.getUser(token);

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.json({ user: data.user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // Logout
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        await supabase.auth.signOut();
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to logout' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
