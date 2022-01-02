import { Prisma } from '@prisma/client';

// Colors from: https://mui.com/customization/color/

export const defaultCategories: Prisma.CategoryCreateWithoutUserInput[] = [
  { name: 'Shopping', color: '#ef5350', type: 'EXPENSE' }, // red 400
  { name: 'Health', color: '#42a5f5', type: 'EXPENSE' }, // blue 400
  { name: 'House', color: 'ab47bc', type: 'EXPENSE' }, // purple 400
  { name: 'Bike', color: '#ffa726', type: 'EXPENSE' }, // orange 400
  { name: 'Food', color: '#26a69a', type: 'EXPENSE' }, // teal 400
  { name: 'Transportation', color: '#78909c', type: 'EXPENSE' }, // blueGrey 400
  { name: 'Education', color: '#66bb6a', type: 'EXPENSE' }, // green 400
  { name: 'Gift', color: '#26c6da', type: 'EXPENSE' }, // cyan 400
  { name: 'Pet', color: '#ffca28', type: 'EXPENSE' }, // amber 400
  { name: 'Others', color: '#bdbdbd', type: 'EXPENSE' }, // grey 400

  { name: 'Salary', color: '#5c6bc0', type: 'INCOME' }, // indigo 400
  { name: 'Investings', color: '#66bb6a', type: 'INCOME' }, // green 400
  { name: 'Gift', color: '#ffa726', type: 'INCOME' }, // orange 400
  { name: 'Others', color: '#8d6e63', type: 'INCOME' }, // brown 400
];

export const defaultTxAccounts: Prisma.TxAccountCreateWithoutUserInput[] = [
  { name: 'Checking', type: 'CHECKING', balance: 0, color: '#ff9800' }, // orange 500
  { name: 'Savings', type: 'SAVINGS', balance: 0, color: '#4caf50' }, // green 500
];

export const defaultPosts: Prisma.PostCreateWithoutAuthorInput[] = [
  { title: 'Join the Prisma Slack', content: 'https://slack.prisma.io', published: true },
];

export const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: { create: defaultPosts },
    categories: { create: defaultCategories },
    txAccounts: { create: defaultTxAccounts },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: { create: defaultPosts },
    categories: { create: defaultCategories },
    txAccounts: { create: defaultTxAccounts },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: { create: defaultPosts },
    categories: { create: defaultCategories },
    txAccounts: { create: defaultTxAccounts },
  },
];
