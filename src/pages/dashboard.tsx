import type { ReactElement } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Layout, { getLayout } from "../components/layouts/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          {/* TODO: render chart */}
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          {/* TODO: render recent deposits */}
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          {/* TODO: render recent orders */}
        </Paper>
      </Grid>
    </Grid>
  );
}

DashboardPage.getLayout = getLayout;
