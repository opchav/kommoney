import type { ReactElement } from "react";
import Grid from "@mui/material/Grid";

import { getLayout } from "../components/layouts/dashboard/Dashboard";
import { Box, IconButton, Popover, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { blue } from "@mui/material/colors";
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

export default function TransactionsPage() {
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
    </>
  );
}

TransactionsPage.getLayout = getLayout;
