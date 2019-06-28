/*

   SublistItem works closely with sublist to implement the custom
   nested list look currently used by Home and SideMenu to display the
   main navigation tree.

*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => ({
    itemIcon: {
	color: theme.palette.secondary.main,
    },
    itemText: {
	color: theme.palette.secondary.main,
	fontSize: '18px',
    },
});

function SublistItem({ classes, label, icon, onClick }) {
    return (
	<div>
	  <List component="div" disablePadding>
	    <ListItem
	      button
	      onClick={onClick}
	    >
	      <ListItemIcon className={classes.itemIcon}>
		{icon}
	      </ListItemIcon>
	      <ListItemText
		  disableTypography
		  primary={
		      <Typography variant="body2" className={classes.itemText}>
			{label}
		      </Typography>
		  }
	      />
	    </ListItem>
	  </List>
	</div>
    );
};

SublistItem.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SublistItem);
