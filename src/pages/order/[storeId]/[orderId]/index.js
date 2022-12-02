import React, { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import _ from 'lodash';

import { apiRoot } from '../../../../config';
import Category, { groupItemsByCategory } from '../../../../widgets/category';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

/*
function for constructing order page output
request order info (json data) from server, after obtain data, group items by category, render view
*/
export default function Order() {
  const router = useRouter();
  const { data, error } = useSWR(`${apiRoot}/order/${router.query.storeId}/${router.query.orderId}`, fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const order = data.order;
  const totalPrice = order.totalPrice;

  const categories = groupItemsByCategory(order.items);

  const categoriesView = categories.map(category =>
    <Category key={category.name} category={category} grid={false} />
  );

  //print list of item details (from particular categories) and receipt with total price
  return (
    <div>
      <Head>
        <title>Order | {order.storeName} | UWO Eats</title>
        <meta name="description" content="Order your food with UWO Eats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      
      <main>
        <Typography variant="h4" gutterBottom>Thanks for ordering!</Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>Here's your receipt for <Link href={`/store/${order.storeId}`}>{order.storeName}</Link>.</Typography>

        {categoriesView}

        <Box sx={{ display: 'flex' }}>
          <Typography variant="h6" mb={2}>Total</Typography>
          <Typography sx={{ flex: 1 }}></Typography>
          <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
        </Box>
      </main>
    </div>
  );
}
