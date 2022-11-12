import Head from 'next/head';
import { useRouter } from 'next/router';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>UWO Eats</title>
        <meta name="description" content="Order your food with UWO Eats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Grid container spacing={2} mb={3}>
          <Grid xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card>
              <CardActionArea onClick={() => router.push('/store/1')}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">Middlesex Sushi</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Using the finest quality fish in the world, our master sushi chefs craft a memorable and delicious meal using traditional edomae techniques.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </main>
    </div>
  );
}
