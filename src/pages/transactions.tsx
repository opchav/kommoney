import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import TransactionsTable from '@/components/transactions/TransactionsTable';
import { MyAppState } from '@/types/my-app';
import MonthSelector from '@/components/MonthSelector';
import TransactionForm from '@/components/TransactionForm';
import TransactionTypeMenu from '@/components/transactions/TransactionTypeMenu';

import { getLayout } from '@/components/layouts/dashboard/Dashboard';
import InputSearch from '@/components/InputSearch';

export default function TransactionsPage({ currentPeriod, setCurrentPeriod }: MyAppState) {
  return (
    <Grid container spacing={3} sx={{ pb: 3 }}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TransactionTypeMenu />
          <MonthSelector setCurrentPeriod={setCurrentPeriod} currentPeriod={currentPeriod} />
          <Box sx={{ flexGrow: 1 }}></Box>
          <InputSearch />
          <TransactionForm />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TransactionsTable />
      </Grid>
    </Grid>
  );
}

TransactionsPage.getLayout = getLayout;
