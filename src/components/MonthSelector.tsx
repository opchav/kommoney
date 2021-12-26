import * as React from "react";
import { Box, IconButton, Button, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { MyAppState } from "../types/my-app";
import { getMonthName, MONTHS } from "../utils/helpers";

const MyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export default function MonthSelector({
  currentMonth,
  setCurrentMonth,
}: MyAppState) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMonthSelected = (i: number) => {
    setCurrentMonth(i);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
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
                  onClick={() => handleMonthSelected(i)}
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
    </>
  );
}
