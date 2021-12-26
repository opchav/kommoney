import Grid from "@mui/material/Grid";

import { getLayout } from "../components/layouts/dashboard/Dashboard";
import {
  Box,
  IconButton,
  Popover,
  Button,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { blue } from "@mui/material/colors";
import React from "react";
import TransactionsTable from "../components/transactions/TransactionsTable";
import { Transaction } from "../types/transaction";
import { MyAppState } from "../types/my-app";
import { getMonthName, MONTHS } from "../utils/helpers";

const MyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function createTransaction(
  title: string,
  value: number,
  type: "income" | "expense",
  date: number,
  paid: number,
  category: string,
  account: string,
  note: string
): Transaction {
  return {
    title,
    value,
    type,
    date,
    paid,
    category,
    account,
    note,
  };
}

const now = new Date().getTime();
const rows = [
  createTransaction("Hamburger", 25, "expense", now, 1, "2", "1", ""),
  createTransaction("Pizza", 50, "expense", now, 1, "1", "1", ""),
  createTransaction("iPhone 13", 6999, "expense", now, 1, "1", "1", ""),
  createTransaction("Rice 2kg", 19, "expense", now, 1, "1", "1", ""),
  createTransaction("Nutella", 9, "expense", now, 1, "1", "1", ""),
  createTransaction("Fralda RN 4kg", 29.99, "expense", now, 1, "1", "1", ""),
  createTransaction("Picole", 7.9, "expense", now, 1, "1", "1", ""),
  createTransaction("Pano de chao", 3.5, "expense", now, 1, "1", "1", ""),
  createTransaction("Vestido", 200, "expense", now, 1, "1", "1", ""),
  createTransaction("Combustivel", 199, "expense", now, 1, "1", "1", ""),
  createTransaction("Energia eletrica", 508, "expense", now, 1, "1", "1", ""),
  createTransaction("Condominio", 167, "expense", now, 1, "1", "1", ""),
  createTransaction("Internet", 104.99, "expense", now, 1, "1", "1", ""),
];

export default function TransactionsPage({
  currentMonth,
  setCurrentMonth,
}: MyAppState) {
  const [transactions, setTransactions] = React.useState<Transaction[]>(rows);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [openModal, setOpenModal] = React.useState(false);
  const [form, setForm] = React.useState<Transaction>({} as Transaction);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const saveTransaction = () => {
    setTransactions((previous) => [...previous, form]);
    handleCloseModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.currentTarget;
    setForm((previous) => ({ ...previous, [id as keyof Transaction]: value }));
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", ml: -2 }}>
            <IconButton>
              <ChevronLeftIcon />
            </IconButton>
            <Box width={200}>
              <MyButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{ width: "100%" }}
              >
                {getMonthName(currentMonth)}, 2021
              </MyButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: 380,
                    p: 1,
                  }}
                >
                  {MONTHS.map(([text], i) => (
                    <Box key={i} sx={{ width: 120 }}>
                      <MyButton
                        sx={{
                          width: "100%",
                          color: i === currentMonth ? blue[800] : "",
                        }}
                        onClick={() => setCurrentMonth(i)}
                      >
                        {text}
                      </MyButton>
                    </Box>
                  ))}
                </Box>
              </Popover>
            </Box>
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
            >
              Add
            </Button>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  New Transaction
                </Typography>
                <Box sx={{ display: "flex", pt: 2 }}>
                  <TextField
                    id="title"
                    label="Title"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    id="value"
                    label="Value"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ display: "flex", pt: 2 }}>
                  <TextField
                    id="type"
                    label="Type"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    id="date"
                    label="Date"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ display: "flex", pt: 2 }}>
                  <TextField
                    id="paid"
                    label="Paid"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    id="category"
                    label="Category"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ display: "flex", pt: 2 }}>
                  <TextField
                    id="account"
                    label="Account"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  <TextField
                    id="note"
                    label="Note"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", pt: 2, justifyContent: "flex-end" }}
                >
                  <Button onClick={saveTransaction} variant="contained">
                    Save
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TransactionsTable transactions={transactions} />
        </Grid>
      </Grid>
    </>
  );
}

TransactionsPage.getLayout = getLayout;
