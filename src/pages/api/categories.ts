import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
  } else if (req.method === 'GET') {
    return handleGET(req, res, session);
  }

  return res.status(409).json({ message: 'Not supported' });
}

async function handleGET(req: NextApiRequest, res: NextApiResponse, session: Session) {
  if (req.method !== 'GET') return false;

  const categories = await prisma.category.findMany({
    where: { user: { email: session.user?.email } },
    select: {
      id: true,
      name: true,
      icon: true,
      type: true,
      color: true,
    },
  });

  res.json({ categories });
}
