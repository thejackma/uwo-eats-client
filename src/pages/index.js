import React, { useState } from 'react';
import Head from 'next/head'
import useSWR from 'swr'

import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { apiRoot } from '../config';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const [cart, setCart] = useState({});
  const { data, error } = useSWR(apiRoot + '/store/1', fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const store = data.store;

  function onQuantityChange(itemId, delta) {
    const newCart = {
      ...cart,
      [itemId]: (cart[itemId] ?? 0) + delta,
    };
    if (newCart[itemId] <= 0) {
      delete newCart[itemId];
    }
    setCart(newCart);
  }

  const categories = store.categories.map(category =>
    <Category key={category.name} category={category} cart={cart} onQuantityChange={onQuantityChange} grid={true} />
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

      <Cart cart={cart} store={store} onQuantityChange={onQuantityChange} />
    </div>
  );
}

function Category(props) {
  const category = props.category;

  const items = props.category.items.map(item =>
    <Item key={item.name} item={item} cart={props.cart} onQuantityChange={props.onQuantityChange} grid={props.grid} />
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
  const quantity = props.cart[item.id] ?? 0;

  function onQuantityChange(delta) {
    props.onQuantityChange(item.id, delta);
  }

  const grid = props.grid;
  const columns = {
    xs: 12,
    sm: grid ? 6 : 12,
    md: grid ? 4 : 12,
    lg: grid ? 3 : 12,
    xl: grid ? 2 : 12,
  };

  return (
    <Grid {...columns}>
      <Card>
        <CardContent sx={{ pb: 0 }}>
          <Typography gutterBottom fontWeight="medium">{item.name}</Typography>
          <Typography variant="body2">${item.price.toFixed(2)}</Typography>
        </CardContent>
        <CardActions sx={{ pt: 0 }} disableSpacing>
          <Typography sx={{ flex: 1 }}></Typography>
          {quantity > 0 &&
            <IconButton onClick={() => onQuantityChange(-1)}>{quantity > 1 ? <RemoveIcon /> : <DeleteIcon />}</IconButton>
          }
          {quantity > 0 &&
            <Typography fontWeight="medium" mx={1}>{quantity}</Typography>
          }
          <IconButton onClick={() => onQuantityChange(1)} sx={{ ml: 0 }}><AddIcon /></IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}

function Cart(props) {
  const [open, setOpen] = useState(false);

  const totalQuantity = Object.values(props.cart).reduce((sum, quantity) => sum + quantity, 0);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (totalQuantity > 0) {
    return (
      <div>
        <Fab onClick={onOpen} variant="extended" sx={{ position: 'fixed', bottom: 32, right: 40 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          Cart • {totalQuantity}
        </Fab>
        <CartPage cart={props.cart} store={props.store} open={open} onClose={onClose} onQuantityChange={props.onQuantityChange} />
      </div>
    );
  }
}

function CartPage(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const filteredCategories = props.store.categories
    .map(category => ({ ...category, items: category.items.filter(item => props.cart.hasOwnProperty(item.id)) }))
    .filter(category => category.items.length > 0);

  const categories = filteredCategories.map(category =>
    <Category key={category.name} category={category} cart={props.cart} onQuantityChange={props.onQuantityChange} grid={false} />
  );

  return (
    <Dialog fullScreen={fullScreen} fullWidth={true} open={props.open} onClose={props.onClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.onClose}><CloseIcon /></IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          </Typography>
          <Button autoFocus color="inherit" onClick={props.onClose}>
            Submit
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {categories}
      </DialogContent>
    </Dialog>
  );
}
