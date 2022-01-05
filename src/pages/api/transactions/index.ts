import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import formatISO from 'date-fns/formatISO';
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

type TransactionQuery = {
  type?: string;
  period: string;
};

// TODO convert to `Period` type
function getDateRange(period: string) {
  const date = period ? new Date(`${period}-15T23:59:59`) : new Date();
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// TODO handle pagination in case this endpoint gets used to retrieve not only data scoped to the selected period
async function handleGET(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'GET') return false;

  const { type: aType, period } = req.query as TransactionQuery;

  // TODO enable searching transactions by description

  const txType = getTxType(aType);
  const dateRange = getDateRange(period);

  // TODO optimize query. currently there are 2 queries to fetch transactions. 1st without period and 2nd with period

  const transactions = await prisma.transaction.findMany({
    where: {
      user: { email: session.user?.email },
      ...(txType && { type: txType }),
      AND: {
        txDate: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
    },
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

function getTxType(txType?: string) {
  if (txType == 'INCOME') return TransactionType.INCOME;
  if (txType == 'EXPENSE') return TransactionType.EXPENSE;
  if (txType == 'TRANSFER') return TransactionType.TRANSFER;
  return;
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'POST') return false;

  const tx = req.body as TransactionInput;

  const result = await prisma.transaction.create({
    data: {
      description: tx.title,
      value: tx.value,
      type: getTxType(tx.type),
      txDate: new Date(tx.txDate),
      paid: tx.paid,
      user: { connect: { email: session.user?.email } },
      category: { connect: { id: tx.category } },
      TxAccount: { connect: { id: tx.account } },
    },
  });

  return res.json({ transaction: result });
}
