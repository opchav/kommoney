import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Button, LinearProgress, Popover } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
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

// TODO handle error try...catch?
async function deleteTransaction(transaction: Transaction) {
  return fetch(`/api/transactions/${transaction.id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
}

type TransactionMutate = {
  transactions: Transaction[];
};

// TODO ensure when clicking delete icon only that row is rerenders. Currently the whole table rerenders.
// -- But rerendering the whole table which hardly contains over 50 rows is even a thing to worry about?

export default function TransactionsTable({ period, transactionType }: PageProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(PER_PAGE_OPTIONS[1]);
  const [deleteTx, setDeleteTx] = React.useState<Transaction | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  // TODO maybe write a hook for each resource: `useTransactions(period), useCategories(), useTxAccounts()`
  const { data, error } = useSWR<{ transactions: Transaction[] }>(transactionsKey(period), fetcher);
  const categories = useSWR<{ categories: Category[] }>('/api/categories', fetcher);
  const txAccounts = useSWR<{ txAccounts: TxAccount[] }>('/api/txaccounts', fetcher);
  const { mutate } = useSWRConfig();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (transaction: Transaction) => {
    console.log('edit', transaction);
  };

  const handleDelete =
    (transaction: Transaction) => (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log('delete', transaction);
      console.log('....', event);
      setDeleteTx(transaction);
      setAnchorEl(event.currentTarget);
    };

  const handleClose = () => {
    // NOTE 2 set state calls cause 2 rerenders???
    setDeleteTx(null);
    setAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    console.log('deleting...', deleteTx.id);
    // TODO ensure transaction date is already a Date type before here (when fetching?)
    const date = new Date(deleteTx.txDate);
    const txPeriod = new Period(date.getMonth(), date.getFullYear());

    mutate<TransactionMutate>(transactionsKey(txPeriod), async (data) => {
      const list = data?.transactions ?? [];
      // TODO error handling?
      await deleteTransaction(deleteTx);
      const newList = list.filter((tx) => tx.id !== deleteTx.id);
      handleClose();
      console.log(`Transaction ${deleteTx.id} deleted`, deleteTx);
      console.log('New list', newList);
      return { transactions: newList };
    });
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

  const listTransactions = data.transactions.filter((tx) => {
    if (!transactionType) return true;
    return transactionType === tx.type
  });

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
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listTransactions
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
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleDelete(row)}
                            aria-labelledby={
                              !!deleteTx && deleteTx.id === row.id ? `tx-del-${row.id}` : undefined
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Popover
                            id={deleteTx?.id === row.id ? `tx-del-${row.id}` : undefined}
                            open={deleteTx?.id === row.id}
                            anchorEl={deleteTx?.id === row.id ? anchorEl : null}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          >
                            <Paper sx={{ width: 'auto', py: 1, px: 2 }}>
                              <Button
                                variant="text"
                                onClick={handleClose}
                                sx={{ color: grey[500] }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                sx={{ backgroundColor: red[500], ml: 2 }}
                                onClick={handleDeleteConfirm}
                              >
                                Delete
                              </Button>
                            </Paper>
                          </Popover>
                        </TableCell>
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
