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
