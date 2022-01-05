import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArticleIcon from '@mui/icons-material/Article';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Switch,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { fetcher, Period } from '@/utils/helpers';
import { grey } from '@mui/material/colors';
import { TransactionType } from '@/types/app';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

type TransactionInput = {
  value: number;
  title: string;
  paid: boolean;
  txDate: Date;
  category: string;
  account: string;
  type: TransactionType;
};

// TODO the add button opens up a menu to select the transaction type. The form
// then already the tx type set

async function saveTransaction(newTx: TransactionInput) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTx),
  });
  return res.json();
}

type Props = {
  currentPeriod: Period;
  transactionType: TransactionType;
};

export default function TransactionForm({ currentPeriod, transactionType }: Props) {
  const { mutate } = useSWRConfig();
  const categories = useSWR('/api/categories', fetcher);
  const txAccounts = useSWR('/api/txaccounts', fetcher);

  // TODO add validations with `yup` or `zod`

  const [open, setOpen] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionInput>({
    defaultValues: {
      title: '',
      value: 10,
      paid: false,
      txDate: new Date(),
      // TODO list categories based on the transaction type selected
      category: '',
      account: '',
      // NOTE why no error if `type` is missing?
    },
  });

  const onSubmit: SubmitHandler<TransactionInput> = (newTransaction) => {
    // TODO set right type for `transactions`. Currently using `Record<string, any>` to speed up dev
    const { txDate, type } = newTransaction;
    const month = `${txDate.getMonth() + 1}`.padStart(2, '0');
    const year = txDate.getFullYear();
    // TODO promote this to some helper
    const query = [`period=${year}-${month}`, `type=${type}`].join('&');

    // TODO after creating a income the table doesn't refresh. fix this.

    // TODO since `api/transactions` comes with a query, build some helper to build this endpoint,
    // or maybe use array [endpoint, period, type] option from swr
    // TODO how to ensure `transactions` is not `undefined` without default `[]`?
    mutate(
      `api/transactions?${query}`,
      // TODO use right type for transactions. fix this ugliness
      async ({ transactions }: { transactions: Record<string, any>[] } = { transactions: [] }) => {
        const createdTx: Record<string, any> = await saveTransaction(newTransaction);
        // TODO better handle `reset`. state change here is causing memory leak warning?
        handleClose();
        return { transactions: [...transactions, createdTx] };
      },
    );
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // TODO add field to allow the user change the type when form is open

  if (!categories.data || !txAccounts.data) {
    return (
      <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalBox>
            <Typography component="h1" variant="h5">
              New {transactionType.toLowerCase()}
            </Typography>
            <Stack>
              <LinearProgress />
            </Stack>
          </ModalBox>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox>
          <Typography component="h1" variant="h5">
            New {transactionType.toLowerCase()}
          </Typography>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* override type `value` here cuz values was always the default one from 1st render EXPENSE */}
            <input type="hidden" {...register('type', { value: transactionType })} />
            <Stack direction="row" alignItems="flex-end">
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">Value</InputLabel>
                <Input
                  id="tx-value"
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  }
                  {...register('value', { required: true })}
                />
              </FormControl>
              <FormControlLabel
                control={<Switch name="paid" {...register('paid')} id="tx-paid" sx={{ ml: 1 }} />}
                label="Paid"
              />
            </Stack>

            <Controller
              control={control}
              name="txDate"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.txDate}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      onChange={onChange}
                      value={value}
                      label="Date"
                      renderInput={(props) => <TextField {...props} variant="standard" />}
                    />
                  </LocalizationProvider>
                  {errors.txDate && <FormHelperText>Select a valid date</FormHelperText>}
                </FormControl>
              )}
            />

            <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.title}>
              <InputLabel htmlFor="standard-adornment-amount">Description</InputLabel>
              <Input
                id="tx-title"
                startAdornment={
                  <InputAdornment position="start">
                    <ArticleIcon />
                  </InputAdornment>
                }
                {...register('title', { required: true })}
              />
              {errors.title && <FormHelperText>Title cannot be empty</FormHelperText>}
            </FormControl>

            <Controller
              control={control}
              name="category"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.category}>
                  <InputLabel id="tx-category-lb">Category</InputLabel>
                  <Select
                    id="tx-category"
                    labelId="tx-category-lb"
                    label="Category"
                    {...field}
                    startAdornment={
                      <InputAdornment position="start">
                        <ArticleIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <Typography component="em" sx={{ color: grey[600] }}>
                        None
                      </Typography>
                    </MenuItem>
                    {/* TODO set type for category to remove `Record` and `as string` */}
                    {(categories.data.categories as Record<string, unknown>[]).map((item) => (
                      <MenuItem key={item.id as string} value={item.id as string}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>Select a valid category</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="account"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.account}>
                  <InputLabel id="tx-account-lb">Account</InputLabel>
                  <Select
                    id="tx-account"
                    labelId="tx-account-lb"
                    label="Account"
                    {...field}
                    startAdornment={
                      <InputAdornment position="start">
                        <ArticleIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <Typography component="em" sx={{ color: grey[600] }}>
                        None
                      </Typography>
                    </MenuItem>
                    {/* TODO set type for txAccount to remove `Record` and `as string` */}
                    {(txAccounts.data.txAccounts as Record<string, unknown>[]).map((item) => (
                      <MenuItem key={item.id as string} value={item.id as string}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.account && <FormHelperText>Select a valid account</FormHelperText>}
                </FormControl>
              )}
            />

            <Box sx={{ display: 'flex', pt: 2, justifyContent: 'flex-end' }}>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Stack>
        </ModalBox>
      </Modal>
    </>
  );
}

/*
import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { Transaction } from "../types/transaction";
import { useTransactionsDispatch } from "../context/TransactionContext";

const ModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
}));

const defaultTx: Transaction = {
  id: "",
  title: "",
  value: 10,
  type: "expense",
  date: new Date().getTime(),
  paid: 0,
  category: "1",
  account: "1",
  note: "",
};

export default function TransactionForm() {
  const [open, setOpen] = React.useState(false);
  const [transaction, setTransaction] = React.useState(defaultTx);
  const dispatch = useTransactionsDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    setTransaction((previous) => ({
      ...previous,
      [id as keyof Transaction]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch({ type: "addTransaction", payload: transaction });
    setTransaction(defaultTx);
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Transaction
          </Typography>
          <Box sx={{ display: "flex", pt: 2 }}>
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              value={transaction.title}
              onChange={handleChange}
            />
            <TextField
              id="value"
              label="Value"
              variant="outlined"
              value={transaction.value}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", pt: 2 }}>
            <TextField
              id="type"
              label="Type"
              variant="outlined"
              value={transaction.type}
              onChange={handleChange}
            />
            <TextField
              id="date"
              label="Date"
              variant="outlined"
              value={transaction.date}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", pt: 2 }}>
            <TextField
              id="paid"
              label="Paid"
              variant="outlined"
              value={transaction.paid}
              onChange={handleChange}
            />
            <TextField
              id="category"
              label="Category"
              variant="outlined"
              value={transaction.category}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", pt: 2 }}>
            <TextField
              id="account"
              label="Account"
              variant="outlined"
              value={transaction.account}
              onChange={handleChange}
            />
            <TextField
              id="note"
              label="Note"
              variant="outlined"
              value={transaction.note}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", pt: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </Box>
        </ModalBox>
      </Modal>
    </>
  );
}
*/
