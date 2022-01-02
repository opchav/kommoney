import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { getLayout } from '../components/layouts/dashboard/Dashboard';

import TransactionsTable from '../components/transactions/TransactionsTable';
import { MyAppState } from '../types/my-app';
import MonthSelector from '../components/MonthSelector';
import TransactionForm from '../components/TransactionForm';
import TransactionTypeMenu from '@/components/transactions/TransactionTypeMenu';

export default function TransactionsPage({ currentMonth, setCurrentMonth }: MyAppState) {
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TransactionTypeMenu />
            <MonthSelector setCurrentMonth={setCurrentMonth} currentMonth={currentMonth} />
            <Box sx={{ flexGrow: 1 }}></Box>
            <TransactionForm />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TransactionsTable />
        </Grid>
      </Grid>
    </>
  );
}

TransactionsPage.getLayout = getLayout;
