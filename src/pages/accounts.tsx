import Grid from "@mui/material/Grid";

import { getLayout } from "../components/layouts/dashboard/Dashboard";
import { Box, Typography } from "@mui/material";

export default function Accounts() {
  return (
    <>
      <Grid container spacing={3} sx={{ pb: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "center", ml: -2 }}>
            <Typography component="h1" variant="h4">
              All your accounts will be listed here
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

Accounts.getLayout = getLayout;
