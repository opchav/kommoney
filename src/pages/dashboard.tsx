import type { ReactElement } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Layout, { getLayout } from "../components/layouts/dashboard/Dashboard";
import { Typography, Box, IconButton, Popover, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { blue, green, grey, red } from "@mui/material/colors";
import React from "react";

const MyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getCurrentMonth = () => {
  const dt = new Date();
  return dt.getMonth();
};

export default function DashboardPage() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [currentMonth, setCurrentMonth] = React.useState(getCurrentMonth());

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
              {/* <Paper sx={{ p: 1, textAlign: "center" }} elevation={0}>
                <Typography>December, 2022</Typography>
              </Paper> */}
              <MyButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{ width: "100%" }}
              >
                {MONTHS[currentMonth]}, 2021
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
                  {MONTHS.map((text, i) => (
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
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item container xs={12} md={8} spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: "flex" }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <ArrowCircleUpIcon sx={{ color: green[800] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem" }}>Incomes</Typography>
                <Typography sx={{ fontWeight: 500 }}>R$ 3850.90</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: "flex" }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <ArrowCircleDownIcon sx={{ color: red[800] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem" }}>Expenses</Typography>
                <Typography sx={{ fontWeight: 500 }}>R$ 3850.90</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <Paper sx={{ p: 2, display: "flex" }} elevation={0}>
              <Box sx={{ pr: 1 }}>
                <IconButton>
                  <AccountBalanceIcon sx={{ color: blue[700] }} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem" }}>Balances</Typography>
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
              display: "flex",
              flexDirection: "column",
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
              display: "flex",
              flexDirection: "column",
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
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
            elevation={0}
          >
            {/* TODO: render recent deposits */}
          </Paper>
        </Grid>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column" }}
            elevation={0}
          >
            {/* TODO: render recent orders */}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

DashboardPage.getLayout = getLayout;
