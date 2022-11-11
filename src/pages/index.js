import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr'

import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';

import { apiRoot } from '../config';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const { data, error } = useSWR(apiRoot + '/store/1', fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const store = data.store;

  const categories = store.categories.map((category) =>
    <Category category={category} />
  );

  return (
    <div>
      <Head>
        <title>UWO Eats</title>
        <meta name="description" content="Order your food with UWO Eats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography variant="h4" gutterBottom>{store.name}</Typography>
        <Typography variant="body2" mb={4}>{store.address}</Typography>
        {categories}
      </main>
    </div>
  );
}

function Category(props) {
  const category = props.category;

  const items = category.items.map((item) =>
    <Item item={item} />
  );

  return (
    <div>
      <Typography variant="h6" mb={2}>{category.name}</Typography>
      <Grid container rowSpacing={2} columnSpacing={2} mb={3}>
        {items}
      </Grid>
    </div>
  );
}

function Item(props) {
  const item = props.item;
  const [quantity, setQuantity] = useState(0);

  return (
    <Grid item xs={4}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent sx={{ pb: 0 }}>
          <Typography gutterBottom fontWeight="medium">{item.name}</Typography>
          <Typography variant="body2">${item.price.toFixed(2)}</Typography>
        </CardContent>
        <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
          {quantity > 0 &&
            <IconButton onClick={() => setQuantity(quantity - 1)}>{quantity > 1 ? <RemoveIcon /> : <DeleteIcon />}</IconButton>
          }
          {quantity > 0 &&
            <Typography fontWeight="medium" mx={1}>{quantity}</Typography>
          }
          <IconButton onClick={() => setQuantity(quantity + 1)}><AddIcon /></IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}
