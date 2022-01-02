import * as React from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import prisma from '@/utils/prisma';
import Router from 'next/router';

type Props = {
  feed: PostProps[];
} & NextPage;

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : 'Unknown author';
  return (
    <Box onClick={() => Router.push('/p/[id]', `/p/${post.id}`)} sx={{ cursor: 'pointer' }}>
      <Typography component="h2" variant="h4">
        {post.title}
      </Typography>
      <Typography component="small" variant="caption">
        {authorName}
      </Typography>
      <Typography>{post.content}</Typography>
    </Box>
  );
};

const Home: React.FC<Props> = (props) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h3">
          Posts
        </Typography>
        <Grid container spacing={3}>
          {props.feed.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card sx={{ p: 2 }}>
                <Post post={post} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  return {
    props: { feed },
  };
};

type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};
