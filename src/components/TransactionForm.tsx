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
import { fetcher, transactionsKey } from '@/utils/helpers';
import Period from '@/types/Period';
import { grey } from '@mui/material/colors';
import { TransactionType, Category, TxAccount, Transaction } from '@/types/app';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

// TODO the add button opens up a menu to select the transaction type. The form
// then already the tx type set

async function saveTransaction(transaction: Transaction) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  // const data = await res.json();
  // return {
  //   id: data.id as string,
  //   title: data.description as string,
  //   value: data.value as number,
  //   txDate: new Date(data.txDate),
  //   paid: data.paid as boolean,
  //   type: data.type,
  // };
  return res.json();
}

type Props = {
  period: Period;
  transactionType: TransactionType;
};

export default function TransactionForm({ period, transactionType }: Props) {
  const { mutate } = useSWRConfig();
  const categories = useSWR<{ categories: Category[] }>('/api/categories', fetcher);
  const txAccounts = useSWR<{ txAccounts: TxAccount[] }>('/api/txaccounts', fetcher);

  // TODO add validations with `yup` or `zod`

  const [open, setOpen] = React.useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Transaction>({
    defaultValues: {
      description: '',
      value: 10,
      paid: false,
      txDate: new Date(),
      // TODO list categories based on the transaction type selected
      categoryId: '',
      txAccountId: '',
      // NOTE why no error if `type` is missing?
    },
  });

  const onSubmit: SubmitHandler<Transaction> = (newTransaction) => {
    // TODO set right type for `transactions`. Currently using `Record<string, any>` to speed up dev
    const { txDate } = newTransaction;
    const txPeriod = new Period(txDate.getMonth(), txDate.getFullYear());

    // TODO after creating a income the table doesn't refresh. fix this.

    // TODO since `api/transactions` comes with a query, build some helper to build this endpoint,
    // or maybe use array [endpoint, period, type] option from swr
    // TODO how to ensure `transactions` is not `undefined` without default `[]`?

    mutate(
      transactionsKey(txPeriod),
      async ({ transactions }: { transactions: Transaction[] } = { transactions: [] }) => {
        // TODO return `Transaction` from save...
        const savedTx = (await saveTransaction(newTransaction)) as Record<string, unknown>;
        handleClose();
        return { transactions: [...transactions, savedTx] };
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

            <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.description}>
              <InputLabel htmlFor="standard-adornment-amount">Description</InputLabel>
              <Input
                id="tx-title"
                startAdornment={
                  <InputAdornment position="start">
                    <ArticleIcon />
                  </InputAdornment>
                }
                {...register('description', { required: true })}
              />
              {errors.description && <FormHelperText>Title cannot be empty</FormHelperText>}
            </FormControl>

            <Controller
              control={control}
              name="categoryId"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.categoryId}>
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
                    {categories.data.categories.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && <FormHelperText>Select a valid category</FormHelperText>}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="txAccountId"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl sx={{ m: 1 }} variant="standard" error={!!errors.txAccountId}>
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
                    {txAccounts.data.txAccounts.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.txAccountId && <FormHelperText>Select a valid account</FormHelperText>}
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
