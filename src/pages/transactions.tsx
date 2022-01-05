import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import TransactionsTable from '@/components/transactions/TransactionsTable';
import { MyAppState } from '@/types/my-app';
import MonthSelector from '@/components/MonthSelector';
import TransactionForm from '@/components/TransactionForm';
import TransactionTypeMenu from '@/components/transactions/TransactionTypeMenu';

import { getLayout } from '@/components/layouts/dashboard/Dashboard';
import InputSearch from '@/components/InputSearch';
import { TransactionType, transactionTypes } from '@/types/app';

export default function TransactionsPage({ currentPeriod, setCurrentPeriod }: MyAppState) {
  const [transactionType, setTransactionType] = React.useState<TransactionType | null>();

  return (
    <Grid container spacing={3} sx={{ pb: 3 }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TransactionTypeMenu
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
          <MonthSelector setCurrentPeriod={setCurrentPeriod} currentPeriod={currentPeriod} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <InputSearch />
          <TransactionForm
            currentPeriod={currentPeriod}
            transactionType={transactionType || transactionTypes.EXPENSE}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TransactionsTable transactionType={transactionType} currentPeriod={currentPeriod} />
      </Grid>
    </Grid>
  );
}

TransactionsPage.getLayout = getLayout;
