import React, { useState, useCallback } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import _ from 'lodash';

import { apiRoot } from '../../../config'; //imported root from config file in src
import Category, { groupItemsByCategory } from '../../../widgets/category'; //import category function

const fetcher = (...args) => fetch(...args).then((res) => res.json())

/*
content and functionalities of store page after click and enter /store/1
*/
export default function Store() {
  const [cart, setCart] = useState({}); //state of what's in the cart
  const router = useRouter();
  const { data, error } = useSWR(`${apiRoot}/store/${router.query.storeId}`, fetcher); //get data from server

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const store = data.store; //get store data after successful loading

  _(store.items).each((item, itemId) => item.itemId = itemId); //handle the received response by adding id to every item

  store.categories = groupItemsByCategory(store.items); //group item by category 

  //funciton for adjusting item quantity in shopping cart
  //function is called when change item quantity by category and item file, get changes back to store file where each item reports changes to shopping cart
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
  
  //call category function and pass in key, category, cart params to show category content 
  const categories = store.categories.map(category =>
    <Category key={category.name} category={category} cart={cart} onQuantityChange={onQuantityChange} grid={true} />
  ); 

  //render the page of store; in order of title, description, store names, categories and cart at the bottom
  return (
    <div>
      <Head>
        <title>{store.name} | UWO Eats</title>
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

//shopping cart state
function Cart(props) {
  const [open, setOpen] = useState(false); //open & close cart 

  const totalQuantity = _(Object.values(props.cart)).sum(); //calculate total quantity with input items in cart

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  //show cart icon (floating action button) when ordered any quantity of item
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
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false); 

  //limit user's repeated order submit
  async function submit() {
    if (submitted) {
      return;
    }

    setSubmitted(true);

    //post shopping cart details to server 
    const response = await fetch(`${apiRoot}/order/${props.store.storeId}`, {
      method: 'post', //send post request
      body: JSON.stringify({ order: { items: props.cart } }),
    }); //shopping cart

    const js = await response.json(); //get response (submit order id)
    
    //jump to order page using router   
    if (js.orderId) {
      router.push(`/order/${props.store.storeId}/${js.orderId}`);
    } else {
      setSubmitted(false);
    }
  }

  //filter and save only the selected items in shopping cart from categories to show
  const categories = props.store.categories
    .map(category => ({ ...category, items: category.items.filter(item => props.cart.hasOwnProperty(item.itemId)) }))
    .filter(category => category.items.length > 0);
  
  //render selected items only from categories (one item per row) 
  const categoriesView = categories.map(category =>
    <Category key={category.name} category={category} cart={props.cart} onQuantityChange={props.onQuantityChange} grid={false} />
  );

  //calculate shopping cart total price of all items
  const totalPrice = _(categories).sumBy(category => _(category.items).sumBy(item => item.price * props.cart[item.itemId]));

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); //get theme and decide the page is full screen or not, if so, pop-up cart page, otherwise takes over full screen

  //Used MUI library for material design: cart, box, Grid, dialog, Appbar...
  return (
    <Dialog fullScreen={fullScreen} fullWidth={true} open={props.open} onClose={props.onClose}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.onClose}><CloseIcon /></IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6"></Typography>
          <Button autoFocus color="inherit" disabled={submitted} onClick={() => submit()}>Submit</Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        {categoriesView}
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h6" mb={2}>Total</Typography>
          <Typography sx={{ flex: 1 }}></Typography>
          <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
