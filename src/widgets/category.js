import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Item from './item'; //import item function

/*
funciton to handle category content illustration by passing every item in category
*/
export default function Category(props) {
  const category = props.category; //particular category to pass

  /*
  call item function, props.onQuantityChanged passed from index file, 
  generate item and render
  */
  const items = category.items.map(item =>
    <Item key={item.id} item={item} cart={props.cart} onQuantityChange={props.onQuantityChange} grid={props.grid} />
  ); 

  /*
  show category name and grid of item
  */
  return (
    <div>
      <Typography variant="h6" mb={2}>{category.name}</Typography>
      <Grid container spacing={2} mb={3}>
        {items}
      </Grid>
    </div>
  );
}

//helper function for grouping items in particular category
export function groupItemsByCategory(items) {
  return _(items)
    .groupBy(it => it.category)
    .entries()
    .map(([name, items]) => ({ name, items }))
    .value();
}
