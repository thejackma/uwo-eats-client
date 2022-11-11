import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr'

import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Typography from '@mui/material/Typography';

import { apiRoot } from '../config';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const [cart, setCart] = useState({});
  const { data, error } = useSWR(apiRoot + '/store/1', fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const store = data.store;

  function updateCart(name, delta) {
    const newCart = {
      ...cart,
      [name]: (cart[name] ?? 0) + delta,
    };
    if (newCart[name] <= 0) {
      delete newCart[name];
    }
    setCart(newCart);
  }

  const categories = store.categories.map((category) =>
    <Category key={category.name} category={category} onQuantityChange={updateCart} />
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

      <Cart cart={cart} />
    </div>
  );
}

function Category(props) {
  const category = props.category;

  const items = props.category.items.map((item) =>
    <Item key={item.name} item={item} onQuantityChange={props.onQuantityChange} />
  );

  return (
    <div>
      <Typography variant="h6" mb={2}>{category.name}</Typography>
      <Grid container spacing={2} mb={3}>
        {items}
      </Grid>
    </div>
  );
}

function Item(props) {
  const item = props.item;
  const [quantity, setQuantity] = useState(0);

  function updateQuantity(delta) {
    setQuantity(quantity + delta);
    props.onQuantityChange(item.name, delta);
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Typography gutterBottom fontWeight="medium">{item.name}</Typography>
          <Typography variant="body2">${item.price.toFixed(2)}</Typography>
        </CardContent>
        <CardActions sx={{ pt: 0, justifyContent: 'flex-end' }}>
          {quantity > 0 &&
            <IconButton onClick={() => updateQuantity(-1)}>{quantity > 1 ? <RemoveIcon /> : <DeleteIcon />}</IconButton>
          }
          {quantity > 0 &&
            <Typography fontWeight="medium" mx={1}>{quantity}</Typography>
          }
          <IconButton onClick={() => updateQuantity(1)}><AddIcon /></IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}

function Cart(props) {
  const totalQuantity = Object.values(props.cart).reduce((sum, x) => sum + x, 0);

  if (totalQuantity > 0) {
    return (
      <Fab variant="extended" sx={{ position: 'fixed', bottom: 32, right: 40 }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        Cart • {totalQuantity}
      </Fab>
    );
  }
}
