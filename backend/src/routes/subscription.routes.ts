import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import Stripe from 'stripe';

const router: Router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {});

// Get subscription plans
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get current subscription
router.get('/current', async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
      include: { plan: true },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create subscription
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const { planId } = req.body;

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe customer and subscription
    const customer = await stripe.customers.create({ email: user.email });

    const subscription = await prisma.subscription.create({
      data: {
        userId: req.userId!,
        planId,
        stripeId: customer.id,
        invoicesLimit: plan.invoicesLimit,
        status: 'active',
      },
      include: { plan: true },
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Cancel subscription
router.post('/cancel', async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription' });
    }

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'canceled', canceledAt: new Date() },
      include: { plan: true },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
