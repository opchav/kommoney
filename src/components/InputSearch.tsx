import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export default function InputSearch({ search, setSearch }: Props) {
  const inputRef = React.useRef(null);

  const handleOpen: React.MouseEventHandler = () => {
    inputRef.current.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
  }

  return (
    <Paper sx={{ display: 'flex', alignItems: 'center', width: 300, mr: 2 }} elevation={0}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search transactions"
        inputProps={{ 'aria-label': 'search transactions' }}
        value={search}
        onChange={handleChange}
        inputRef={inputRef}
      />
      <IconButton type="submit" aria-label="search" onClick={handleOpen}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
