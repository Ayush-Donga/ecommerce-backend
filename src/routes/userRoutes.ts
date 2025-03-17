import express, { Request, Response, Router } from 'express';
import { User } from '../models/user';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

// Extend the Request type to include our custom user property
interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

const router: Router = express.Router();

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const user = await User.create({ email, password, name });
    const token = User.generateToken(user);
    res.status(201).json({ user: { id: user.id, email, name }, token });
  } catch (error) {
    res.status(400).json({ error: 'User registration failed' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const token = User.generateToken(user);
    res.json({ user: { id: user.id, email, name: user.name }, token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

// Get all users (Admin only)
router.get(
  '/', 
  authenticate,
  authorizeAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch users' });
    }
  }
);

// Get user by ID
router.get(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(parseInt(req.params.id));
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch user' });
    }
  }
);

// Update user
router.put(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
      
      const user = await User.update(userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update user' });
    }
  }
);

export default router;