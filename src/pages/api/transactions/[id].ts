import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: '401 - Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const transaction = await getTransaction(id, session);
      if (!transaction) {
        return res.status(404).json({ message: '404 - Not Found' });
      }
      // TODO return response object (DTO) instead of model.
      return res.status(200).json({ transaction });
    }

    if (req.method === 'DELETE') {
      const transaction = await getTransaction(id, session);
      if (!transaction) {
        return res.status(404).json({ message: '404 - Not Found' });
      }
      // await prisma.transaction.delete({ where: { id: transaction.id } });
      return res.status(204).json({ message: 'ok' });
    }

    return res.status(405).json({ message: '405 - Method Not Allowed' });
  } catch (error) {
    console.log(error);
    // TODO check if not found error and throw 403 otherwise 400 or 500??
    return res.status(403).json({ message: '403 - Forbidden' });
  }
}

async function getTransaction(id: string, session: Session) {
  // TODO once sharing a tx with other user is implemented this query
  // needs to be updated to allow the other user
  return prisma.transaction.findFirst({
    where: {
      id,
      user: { email: session.user.email },
    },
  });
}
