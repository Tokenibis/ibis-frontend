import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const options = ['Favorites', 'Featured', 'Popular', 'Following', 'Public'];

function DummyFilter({ onClose, selectedValue, ...other}) {
  return (
    <Dialog onClose={() => onClose(selectedValue)} aria-labelledby="simple-dialog-title" {...other}>
      <DialogTitle id="simple-dialog-title">Filter Options</DialogTitle>
      <List>
        {options.map(opt => (
          <ListItem button onClick={() => onClose(opt)} key={opt}>
            <ListItemText primary={opt} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default DummyFilter;

