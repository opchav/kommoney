import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import DashboardIcon from '@mui/icons-material/Dashboard';
import TransactionsIcon from '@mui/icons-material/Assignment';
import Link from '../../Link';
import { useRouter } from 'next/router';

const menu = [
  { href: '/', text: 'Dashboard', Icon: DashboardIcon },
  { href: '/transactions', text: 'Transactions', Icon: TransactionsIcon },
  { href: '/accounts', text: 'Accounts', Icon: TransactionsIcon },
  { href: '/budget', text: 'Budget', Icon: TransactionsIcon },
];

export const MenuListItems = () => {
  const router = useRouter();

  return (
    <>
      {menu.map(({ href, Icon, text }, i) => (
        <ListItem key={i} button component={Link} href={href} selected={href === router.route}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </>
  );
};
