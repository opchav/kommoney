import * as React from 'react';
import useSWR from 'swr';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { blue, green, red } from '@mui/material/colors';

import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

import { getLayout } from '@/components/layouts/dashboard/Dashboard';
import MonthSelector from '@/components/MonthSelector';
import Period from '@/types/Period';
import { Transaction } from '@/types/app';
import { fetcher, transactionsKey } from '@/utils/helpers';
import { Alert, Button, LinearProgress, Stack } from '@mui/material';

type PageProps = {
  period: Period;
  setPeriod: React.Dispatch<React.SetStateAction<Period>>;
};

export default function DashboardPage({ period, setPeriod }: PageProps) {
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: -4 }}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item container xs={12} md={8} spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: 'flex' }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <ArrowCircleUpIcon sx={{ color: green[800] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.85rem' }}>Incomes</Typography>
                <Typography sx={{ fontWeight: 500 }}>R$ 3850.90</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: 'flex' }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <ArrowCircleDownIcon sx={{ color: red[800] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.85rem' }}>Expenses</Typography>
                <Typography sx={{ fontWeight: 500 }}>R$ 3850.90</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: 'flex' }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <AccountBalanceIcon sx={{ color: blue[700] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.85rem' }}>Balances</Typography>
                <Typography sx={{ fontWeight: 500 }}>R$ 3850.90</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {/* Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
            elevation={0}
          >
            {/* TODO: render chart */}
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={3} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
            elevation={0}
          >
            {/* TODO: render recent deposits */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
            elevation={0}
          >
            {/* TODO: render recent deposits */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }} elevation={0}>
            <LatestTransactionsTable period={period} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

DashboardPage.getLayout = getLayout;

function LatestTransactionsTable({ period }: { period: Period }) {
  const { data, error } = useSWR<{ transactions: Transaction[] }>(transactionsKey(period), fetcher);

  // TODO list categories and accounts. use some hook to reuse code

  if (!data) {
    return (
      <Stack sx={{ width: '100%' }}>
        <LinearProgress />
      </Stack>
    );
  }
  if (error) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                console.log('retry');
              }}
            >
              Retry
            </Button>
          }
        >
          Failed to load latest transactions
        </Alert>
      </Stack>
    );
  }

  const { transactions } = data;

  if (!transactions.length) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="info">No transactions for the selected period.</Alert>
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Paid</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.slice(0, 10).map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">
                {row.paid ? (
                  <CheckCircleOutlineIcon sx={{ color: green[300] }} />
                ) : (
                  <ErrorOutlineOutlinedIcon sx={{ color: red[300] }} />
                )}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.description}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{format(new Date(row.txDate), 'yyyy-MM-dd')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
