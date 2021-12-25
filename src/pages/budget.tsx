import Grid from "@mui/material/Grid";

import { getLayout } from "../components/layouts/dashboard/Dashboard";
import { Box, Typography } from "@mui/material";

export default function BudgetPage() {
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", ml: -2 }}>
            <Typography component="h1" variant="h4">
              Your budget planning
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

BudgetPage.getLayout = getLayout;
