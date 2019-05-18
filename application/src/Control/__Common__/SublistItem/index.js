import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function SublistItem({ classes, label, icon, onClick }) {
    return (
	<div>
	  <List component="div" disablePadding>
	    <ListItem
	      button
	      className={classes.nested}
	      onClick={onClick}
	    >
	      <ListItemIcon>
		{icon}
	      </ListItemIcon>
	      <ListItemText
		  disableTypography
		  primary={
		      <Typography type="body2" className={classes.link}>
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

export default SublistItem;
