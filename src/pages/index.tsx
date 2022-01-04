import Typography from '@mui/material/Typography';
import { getLayout } from '@/components/layouts/Landing';

export default function HomePage() {
  return (
    <>
      <Typography component="h1" variant="h4">
        Welcome to KomMoney
      </Typography>
    </>
  );
}

HomePage.getLayout = getLayout;
