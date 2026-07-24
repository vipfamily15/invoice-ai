import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';
import OpenAI from 'openai';
import fs from 'fs';

const router: Router = express.Router();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Get all invoices
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const invoices = await prisma.invoice.findMany({
      where: { userId: req.userId },
      include: { lineItems: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.invoice.count({ where: { userId: req.userId } });

    res.json({ invoices, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Upload and process invoice
router.post('/upload', upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check subscription limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId },
      include: { plan: true },
    });

    if (subscription && subscription.invoicesUsed >= subscription.invoicesLimit) {
      return res.status(403).json({ error: 'Invoice limit exceeded. Upgrade your plan.' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const base64 = fileBuffer.toString('base64');
    const mediaType = req.file.mimetype === 'application/pdf' ? 'application/pdf' : 'image/jpeg';

    // Process with OpenAI Vision
    const response = await openai.messages.create({
      model: 'gpt-4-vision-preview',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as any,
                data: base64,
              },
            },
            {
              type: 'text',
              text: 'Extract the following from this invoice and return as JSON: vendorName, vendorEmail, vendorAddress, amount, currency, invoiceDate (YYYY-MM-DD), dueDate (YYYY-MM-DD), invoiceNumber, tax, description, and lineItems (array with description, quantity, unitPrice). Return ONLY valid JSON, no other text.',
            },
          ],
        },
      ],
    });

    const extractedText = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const extractedData = JSON.parse(extractedText);

    // Save invoice
    const invoice = await prisma.invoice.create({
      data: {
        userId: req.userId!,
        vendorName: extractedData.vendorName || 'Unknown',
        vendorEmail: extractedData.vendorEmail,
        vendorAddress: extractedData.vendorAddress,
        amount: extractedData.amount || 0,
        currency: extractedData.currency || 'USD',
        invoiceDate: new Date(extractedData.invoiceDate || new Date()),
        dueDate: extractedData.dueDate ? new Date(extractedData.dueDate) : null,
        invoiceNumber: extractedData.invoiceNumber || `INV-${Date.now()}`,
        tax: extractedData.tax || 0,
        description: extractedData.description,
        fileUrl: req.file.path,
        fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'image',
        extractedData: JSON.stringify(extractedData),
        processedAt: new Date(),
        status: 'completed',
      },
    });

    // Update subscription usage
    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { invoicesUsed: subscription.invoicesUsed + 1 },
      });
    }

    res.status(201).json({ invoice, extractedData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process invoice' });
  }
});

// Get invoice details
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: { lineItems: true },
    });

    if (!invoice || invoice.userId !== req.userId) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });

    if (!invoice || invoice.userId !== req.userId) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (fs.existsSync(invoice.fileUrl)) {
      fs.unlinkSync(invoice.fileUrl);
    }

    await prisma.invoice.delete({ where: { id: req.params.id } });

    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
