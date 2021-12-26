import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { blue, green, red } from "@mui/material/colors";

import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import { MyAppState } from "../types/my-app";
import { getLayout } from "../components/layouts/dashboard/Dashboard";
import MonthSelector from "../components/MonthSelector";

// TODO `currentMonth` and `setCurrentMonth` are not used directly here neither on the transactions page component
// those two can potentially be promoted to a context

export default function DashboardPage({
  currentMonth,
  setCurrentMonth,
}: MyAppState) {
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", ml: -2 }}>
            <MonthSelector
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
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
