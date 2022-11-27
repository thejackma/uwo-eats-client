import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Item from './item';

export default function Category(props) {
  const category = props.category;

  const items = category.items.map(item =>
    <Item key={item.id} item={item} cart={props.cart} onQuantityChange={props.onQuantityChange} grid={props.grid} />
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

export function groupItemsByCategory(items) {
  return _(items)
    .groupBy(it => it.category)
    .entries()
    .map(([name, items]) => ({ name, items }))
    .value();
}
