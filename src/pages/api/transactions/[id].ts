import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { Prisma, Transaction, TransactionType } from '@prisma/client';

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

      await prisma.$transaction(async (prisma) => {

        const account = await prisma.txAccount.findUnique({ where: { id: transaction.txAccountId } })

        let balance = account.balance
        if (transaction.paid) {
          if (transaction.type === TransactionType.INCOME) {
            balance = balance.sub(transaction.value)
          } else if (transaction.type === TransactionType.EXPENSE) {
            balance = balance.add(transaction.value);
          }
        }

        await prisma.txAccount.update({
          where: { id: account.id },
          data: { balance }
        })

        await prisma.transaction.delete({ where: { id: transaction.id } });
      })

      return res.status(204).send('');
    }

    // NOTE: txAccount can't be changed.
    //       -- TODO: support txAccount change (change balance of the current and new account is needed)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const bodyTx = req.body as Transaction;
      const dbTx = await getTransaction(id, session);

      const transaction = await prisma.$transaction(async (prisma) => {

        const account = await prisma.txAccount.findUnique({ where: { id: dbTx.txAccountId } })
        let balance = account.balance;
        const value = new Prisma.Decimal(bodyTx.value);
        const txValue = dbTx.value;

        // It wasn't paid and now it is still not
        if (!dbTx.paid && !bodyTx.paid) {
          // no changes to account balance
        }

        // It wasn't paid and now it is
        //   - if expense should decrease the balance
        //     balance = 1000, value = 100, new balance = 900
        //   - if income should increase the balance
        //     balance = 1000, value = 100, new balance = 1100
        if (!dbTx.paid && bodyTx.paid) {
          if (dbTx.type === TransactionType.EXPENSE) {
            balance = balance.sub(value)
          } else {
            balance = balance.add(value);
          }
        }

        // It was paid and now it is not
        //   - if expense should increase the balance
        //     balance = 1000, value = 100, new balance = 1100
        //   - if income should decrease the balance
        //     balance = 1000, value = 100, new balance = 900
        if (dbTx.paid && !bodyTx.paid) {
          if (dbTx.type === TransactionType.EXPENSE) {
            balance = balance.add(txValue)
          } else {
            balance = balance.sub(txValue);
          }
        }

        // it was paid and now it is still paid
        // only change the balance if the value is different
        if (dbTx.paid && bodyTx.paid && value !== txValue) {
          if (dbTx.type === TransactionType.EXPENSE) {
            // add existing tx value to return balance to previous state then decrease the new value
            balance = balance.add(txValue).sub(value);
          } else {
            balance = balance.sub(txValue).add(value);
          }
        }

        if (balance !== account.balance) {
          await prisma.txAccount.update({
            where: { id: account.id },
            data: { balance }
          })
        }

        return prisma.transaction.update({
          where: { id: dbTx.id },
          data: {
            value,
            description: bodyTx.description,
            paid: bodyTx.paid,
            note: bodyTx.note,
            categoryId: bodyTx.categoryId,
          }
        })

      })

      return res.status(200).json({ transaction })
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

