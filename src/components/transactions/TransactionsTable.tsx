import * as React from 'react';
import useSWR from 'swr';
import format from 'date-fns/format';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Alert, LinearProgress, Stack } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { TransactionType, Transaction, Category, TxAccount } from '@/types/app';
import { fetcher, transactionsKey } from '@/utils/helpers';
import Period from '@/types/Period';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Transaction;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'paid', numeric: false, disablePadding: false, label: 'Paid' },
  { id: 'description', numeric: false, disablePadding: true, label: 'Title' },
  { id: 'value', numeric: true, disablePadding: false, label: 'Value' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
  { id: 'txDate', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'categoryId', numeric: true, disablePadding: false, label: 'Category' },
  { id: 'txAccountId', numeric: true, disablePadding: false, label: 'Account' },
  { id: 'note', numeric: false, disablePadding: false, label: 'Note' },
];

type PageProps = {
  transactionType: TransactionType;
  period: Period;
};

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// TODO move to some helper/class
function findCategory(id: string, list: Category[]) {
  return list.find((item) => item.id === id);
}

function findTxAccount(id: string, list: TxAccount[]) {
  return list.find((item) => item.id === id);
}

export default function TransactionsTable({ period }: PageProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(PER_PAGE_OPTIONS[1]);

  // TODO maybe write a hook for each resource: `useTransactions(period), useCategories(), useTxAccounts()`
  const { data, error } = useSWR<{ transactions: Transaction[] }>(transactionsKey(period), fetcher);
  const categories = useSWR<{ categories: Category[] }>('/api/categories', fetcher);
  const txAccounts = useSWR<{ txAccounts: TxAccount[] }>('/api/txaccounts', fetcher);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;
  const emptyRows = 0;

  if (!data || !data.transactions.length) {
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" id="tableTitle" component="div">
              Transactions
            </Typography>
          </Toolbar>
          <Box sx={{ width: '100%', p: 2 }}>
            <Alert severity="info">No transactions for the selected period.</Alert>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" id="tableTitle" component="div">
            Transactions
          </Typography>
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        {error && <Typography>TODO Errorrrrrrrrrrr</Typography>}
        {!data && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        {data && categories.data && txAccounts.data && (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'}>
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow hover tabIndex={-1} key={row.id}>
                        <TableCell align="left">
                          {row.paid ? (
                            <CheckCircleOutlineIcon sx={{ color: green[300] }} />
                          ) : (
                            <ErrorOutlineOutlinedIcon sx={{ color: red[300] }} />
                          )}
                        </TableCell>
                        <TableCell component="th" id={`row-tx-${index}`} scope="row">
                          {row.description}
                        </TableCell>
                        <TableCell align="right">{row.value}</TableCell>
                        <TableCell align="right">{row.type}</TableCell>
                        <TableCell align="right">
                          {format(new Date(row.txDate), 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell align="right">
                          {findCategory(row.categoryId, categories.data.categories)?.name}
                        </TableCell>
                        <TableCell align="right">
                          {findTxAccount(row.txAccountId, txAccounts.data.txAccounts)?.name}
                        </TableCell>
                        <TableCell align="right">{row.note}</TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={PER_PAGE_OPTIONS}
              component="div"
              count={data.transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Box>
  );
}
