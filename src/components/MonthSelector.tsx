import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { MyAppState } from '../types/my-app';
import { getMonthName, MONTHS } from '../utils/helpers';

const MyButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}));

export default function MonthSelector({ currentPeriod, setCurrentPeriod }: MyAppState) {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClose = (checkYear = true) => {
    setAnchorEl(null);
    // just in case the use selects a different a year but doesn't confirm.
    // When closing the poppover ensure the year selector = current period's year
    if (checkYear && year !== currentPeriod.year) {
      setYear(currentPeriod.year);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectPeriod = (month: number) => {
    setCurrentPeriod({ month, year });
    handleClose(false);
  };

  const handleNextPeriod = () => {
    if (currentPeriod.month === 11) {
      setCurrentPeriod((prev) => ({ month: 0, year: prev.year + 1 }));
      setYear(currentPeriod.year + 1);
    } else {
      setCurrentPeriod((prev) => ({ month: prev.month + 1, year: prev.year }));
    }
  };

  const handlePrevPeriod = () => {
    if (currentPeriod.month === 0) {
      setCurrentPeriod((prev) => ({ month: 11, year: prev.year - 1 }));
      setYear(currentPeriod.year - 1);
    } else {
      setCurrentPeriod((prev) => ({ month: prev.month - 1, year: prev.year }));
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton onClick={handlePrevPeriod} sx={{ ml: 3 }}>
        <ChevronLeftIcon />
      </IconButton>
      <Box width={200}>
        <MyButton aria-describedby={id} onClick={handleClick} sx={{ width: '100%' }}>
          {getMonthName(currentPeriod.month)}, {currentPeriod.year}
        </MyButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Grid container spacing={1} sx={{ width: 400, p: 1 }}>
            {/* Year selector */}
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" spacing={3} justifyContent="center" pt={1}>
                <IconButton onClick={() => setYear((state) => state - 1)}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography>{year}</Typography>
                <IconButton onClick={() => setYear((state) => state + 1)}>
                  <ChevronRightIcon />
                </IconButton>
              </Stack>
            </Grid>
            {MONTHS.map(([text], i) => (
              <Grid item xs={3} sm={2} md={4} key={i}>
                <MyButton
                  sx={{
                    width: '100%',
                    color: i === currentPeriod.month ? blue[800] : '',
                    p: 1,
                  }}
                  variant={i === currentPeriod.month ? 'outlined' : 'text'}
                  onClick={() => handleSelectPeriod(i)}
                >
                  {text}
                </MyButton>
              </Grid>
            ))}
          </Grid>
        </Popover>
      </Box>
      <IconButton onClick={handleNextPeriod}>
        <ChevronRightIcon />
      </IconButton>
    </>
  );
}
