import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TransactionType, transactionTypes } from '@/types/app';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 4,
    marginTop: theme.spacing(0.5),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: theme.shadows[1],
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

type Props = {
  transactionType: TransactionType;
  setTransactionType: React.Dispatch<React.SetStateAction<TransactionType>>;
};

export default function TransactionTypeMenu({ transactionType, setTransactionType }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelect =
    (txType: TransactionType | null = null): React.MouseEventHandler =>
    (): void => {
      setTransactionType(txType);
      handleClose();
    };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {transactionType || 'Transactions'}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{ 'aria-labelledby': 'demo-customized-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSelect()} disableRipple>
          <EditIcon />
          Transactions
        </MenuItem>
        <MenuItem onClick={handleSelect(transactionTypes.EXPENSE)} disableRipple>
          <FileCopyIcon />
          Expenses
        </MenuItem>
        <MenuItem onClick={handleSelect(transactionTypes.INCOME)} disableRipple>
          <ArchiveIcon />
          Incomes
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
