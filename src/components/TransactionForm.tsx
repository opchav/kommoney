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
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  Switch,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { fetcher } from '@/utils/helpers';

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
  type: 'income' | 'expense';
};

const initTransaction: TransactionInput = {
  title: '',
  value: 10,
  paid: false,
  txDate: new Date(),
  category: 'ckxxfepsh0003wqw52q8xgfuu',
  account: 'ckxxfepsh0031wqw5p7x40gi3',
  type: 'expense',
};

async function saveTransaction(newTx: TransactionInput) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTx),
  });
  return res.json();
}

export default function TransactionForm() {
  const { mutate } = useSWR('/api/transactions', fetcher);
  const [open, setOpen] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionInput>();

  const onSubmit: SubmitHandler<TransactionInput> = (newTransaction) => {
    // TODO set right type for `transactions`. Currently using `Record<string, any>` to speed up dev
    mutate(async (data: { transactions: Record<string, any>[] }) => {
      console.log('txxxxx', data);
      const createdTx: Record<string, any> = await saveTransaction(newTransaction);
      setOpen(false);
      return { transactions: [...data.transactions, createdTx] };
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            New expense
          </Typography>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="row" alignItems="flex-end">
              <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                <InputLabel htmlFor="standard-adornment-amount">Value</InputLabel>
                <Input
                  id="tx-value"
                  type="number"
                  defaultValue={initTransaction.value}
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

            <FormControl sx={{ m: 1 }} variant="standard">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  control={control}
                  name="txDate"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      onChange={onChange}
                      value={value}
                      renderInput={(props) => <TextField {...props} variant="standard" />}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>

            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">Description</InputLabel>
              <Input
                id="tx-title"
                defaultValue={initTransaction.title}
                startAdornment={
                  <InputAdornment position="start">
                    <ArticleIcon />
                  </InputAdornment>
                }
                {...register('title', { required: true })}
              />
            </FormControl>

            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">Category</InputLabel>
              <Input
                id="tx-category"
                defaultValue={initTransaction.category}
                startAdornment={
                  <InputAdornment position="start">
                    <ArticleIcon />
                  </InputAdornment>
                }
                {...register('category', { required: true })}
              />
            </FormControl>

            <FormControl sx={{ m: 1 }} variant="standard">
              <InputLabel htmlFor="standard-adornment-amount">Account</InputLabel>
              <Input
                id="tx-account"
                defaultValue={initTransaction.account}
                startAdornment={
                  <InputAdornment position="start">
                    <ArticleIcon />
                  </InputAdornment>
                }
                {...register('account', { required: true })}
              />
            </FormControl>

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
