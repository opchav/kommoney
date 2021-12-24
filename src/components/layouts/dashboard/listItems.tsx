import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import TransactionsIcon from "@mui/icons-material/Assignment";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <TransactionsIcon />
      </ListItemIcon>
      <ListItemText primary="Transactions" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <TransactionsIcon />
      </ListItemIcon>
      <ListItemText primary="Accounts" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <TransactionsIcon />
      </ListItemIcon>
      <ListItemText primary="Budget" />
    </ListItem>
  </div>
);
