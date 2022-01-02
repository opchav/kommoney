import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Transaction } from '../../types/transaction';
import { useTransactions } from '../../context/TransactionContext';

interface HeadCell {
  disablePadding: boolean;
  id: keyof Transaction;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Title',
  },
  {
    id: 'value',
    numeric: true,
    disablePadding: false,
    label: 'Value',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'paid',
    numeric: true,
    disablePadding: false,
    label: 'Paid',
  },
  {
    id: 'category',
    numeric: true,
    disablePadding: false,
    label: 'Category',
  },
  {
    id: 'account',
    numeric: true,
    disablePadding: false,
    label: 'Account',
  },
  {
    id: 'note',
    numeric: false,
    disablePadding: false,
    label: 'Note',
  },
];

export default function TransactionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const transactions = useTransactions();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

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
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover tabIndex={-1} key={row.title}>
                    <TableCell component="th" id={`row-tx-${index}`} scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.value}</TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{new Date(row.date).toLocaleString()}</TableCell>
                    <TableCell align="right">{row.paid ? 'Yes' : 'no'}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.account}</TableCell>
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
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
