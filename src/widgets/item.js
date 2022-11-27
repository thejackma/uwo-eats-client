import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';

export default function Item(props) {
  const item = props.item;
  const quantity = item.quantity ?? props.cart[item.itemId] ?? 0;

  function onQuantityChange(delta) {
    props.onQuantityChange(item.itemId, delta);
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
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2">${item.price.toFixed(2)}</Typography>
            <Typography sx={{ flex: 1 }}></Typography>
            {quantity > 0 &&
              <Typography variant="body2">${(item.price * quantity).toFixed(2)}</Typography>
            }
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <Typography sx={{ flex: 1 }}></Typography>
          {props.onQuantityChange && quantity > 0 &&
            <IconButton onClick={() => onQuantityChange(-1)}>{quantity > 1 ? <RemoveIcon /> : <DeleteIcon />}</IconButton>
          }
          {quantity > 0 &&
            <Typography fontWeight="medium" mx={1} sx={{ py: 1 }}>{quantity}</Typography>
          }
          {props.onQuantityChange &&
            <IconButton onClick={() => onQuantityChange(1)} sx={{ ml: 0 }}><AddIcon /></IconButton>
          }
        </CardActions>
      </Card>
    </Grid>
  );
}
