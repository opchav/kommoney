import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import TransactionsTable from '@/components/transactions/TransactionsTable';
import MonthSelector from '@/components/MonthSelector';
import TransactionForm from '@/components/TransactionForm';
import TransactionTypeMenu from '@/components/transactions/TransactionTypeMenu';

import { getLayout } from '@/components/layouts/dashboard/Dashboard';
import InputSearch from '@/components/InputSearch';
import { TransactionType, transactionTypes } from '@/types/app';
import Period from '@/types/Period';

type PageProps = {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
};

export default function TransactionsPage({ period, setPeriod }: PageProps) {
  const [transactionType, setTransactionType] = React.useState<TransactionType | null>();

  return (
    <Grid container spacing={3} sx={{ pb: 3 }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TransactionTypeMenu
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
          <MonthSelector period={period} setPeriod={setPeriod} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <InputSearch />
          <TransactionForm
            period={period}
            transactionType={transactionType || transactionTypes.EXPENSE}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TransactionsTable transactionType={transactionType} period={period} />
      </Grid>
    </Grid>
  );
}

TransactionsPage.getLayout = getLayout;
