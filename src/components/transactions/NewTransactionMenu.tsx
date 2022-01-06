import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TransactionType, transactionTypes } from '@/types/app';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: theme.spacing(0.5),
    boxShadow: theme.shadows[1],
  },
}));

type Props = {
  transactionType: TransactionType;
  setTransactionType: React.Dispatch<React.SetStateAction<TransactionType>>;
};

export default function NewTransactionMenu({ transactionType, setTransactionType }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect = (txType: TransactionType, close = true): void => {
    console.log({ txType });
    setTransactionType(txType);
    close && handleClose();
  };

  if (transactionType) {
    return (
      <Button
        id="new-tx-menu-button"
        variant="contained"
        disableElevation
        onClick={() => handleSelect(transactionType, false)}
      >
        + {transactionType}
      </Button>
    );
  }

  if (!transactionType) {
    return (
      <div>
        <Button
          id="new-tx-menu-button"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          New
        </Button>
        <StyledMenu
          id="new-tx-menu"
          MenuListProps={{ 'aria-labelledby': 'new-tx-menu-button' }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleSelect(transactionTypes.EXPENSE)} disableRipple>
            Expense
          </MenuItem>
          <MenuItem onClick={() => handleSelect(transactionTypes.INCOME)} disableRipple>
            Income
          </MenuItem>
        </StyledMenu>
      </div>
    );
  }
}
