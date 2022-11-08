import Head from 'next/head'
import useSWR from 'swr'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';

import { apiRoot } from '../config';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
  const { data, error } = useSWR(apiRoot + '/store/1', fetcher);

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const store = data.store;

  const items = store.items.map((item) =>
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        {item.name}
      </CardContent>
      <CardActions>
        <IconButton>
          <RemoveIcon />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <div>
      <Head>
        <title>UWO Eats</title>
        <meta name="description" content="Order your food with UWO Eats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{store.name}</h1>
        {items}
      </main>
    </div>
  );
}
