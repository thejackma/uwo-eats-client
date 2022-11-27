import React, { useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import AddIcon from '@mui/icons-material/Add';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
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

import _ from 'lodash';

import { apiRoot } from '../../../../config';
import { Category } from '../../../widgets/category';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Store() {
  const router = useRouter();
  const { data, error } = useSWR(`${apiRoot}/order/${router.query.storeId}/${router.query.orderId}`, fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const order = data.order;

  return (
    <div>
      <Head>
        <meta name="description" content="Order your food with UWO Eats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {order}
    </div>
  );
}
