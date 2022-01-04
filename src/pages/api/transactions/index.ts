import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { TransactionType } from '@prisma/client';

type TransactionInput = {
  value: number;
  title: string;
  paid: boolean;
  txDate: Date;
  category: string;
  account: string;
  type: TransactionType;
};

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // const { title, content } = req.body;

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    return handlePOST(req, res, session);
  } else if (req.method === 'GET') {
    return handleGET(req, res, session);
  }

  return res.json({ method: req.method });
}

async function handleGET(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'GET') return false;

  const transactions = await prisma.transaction.findMany({
    where: { user: { email: session.user?.email } },
    select: {
      id: true,
      description: true,
      value: true,
      txDate: true,
      note: true,
      type: true,
      updatedAt: true,
      createdAt: true,
      paid: true,
      category: { select: { id: true, name: true } },
      TxAccount: { select: { id: true, name: true } },
    },
  });

  res.json({ transactions });
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'POST') return false;

  const tx = req.body as TransactionInput;

  const result = await prisma.transaction.create({
    data: {
      description: tx.title,
      value: tx.value,
      type: tx.type,
      txDate: new Date(tx.txDate),
      paid: tx.paid,
      user: { connect: { email: session.user?.email } },
      category: { connect: { id: tx.category } },
      TxAccount: { connect: { id: tx.account } },
    },
  });

  console.log('>>>>', result);

  return res.json({ transaction: result });
}
