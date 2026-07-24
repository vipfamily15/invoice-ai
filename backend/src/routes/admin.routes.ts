import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, adminMiddleware } from '../middleware/auth.middleware';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Dashboard stats
router.get('/dashboard', adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalInvoices = await prisma.invoice.count();
    const totalRevenue = await prisma.subscription.aggregate({
      where: { status: 'active' },
      _sum: { plan: { price: true } },
    });

    const recentInvoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      stats: {
        totalUsers,
        totalInvoices,
        monthlyRevenue: totalRevenue._sum?.price || 0,
      },
      recentInvoices,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all users
router.get('/users', adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { subscription: { include: { plan: true } }, invoices: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
