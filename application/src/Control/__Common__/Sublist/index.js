/*

   Sublist works closely with SublistItem to implement the custom
   nested list look currently used by Home and SideMenu to display the
   main navigation tree.

*/

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import CustomDivider from '../../../__Common__/CustomDivider';

const styles = theme => ({
    itemIcon: {
	color: theme.palette.primary.main,
    },
    itemText: {
	color: theme.palette.primary.main,
	fontSize: '18px',
    },
    collapse: {
	paddingLeft: theme.spacing(2),
    },
});

function Sublist({ classes, label, value, icon, children, onClick }) {
    return (
	<div>
	  <ListItem button onClick={onClick}>
	    <ListItemIcon className={classes.itemIcon}>
	      {icon}
	    </ListItemIcon>
	    <ListItemText primary={
		<Typography variant="body2" className={classes.itemText}>
		  {label}
		</Typography>
	    } />
	    {value ?
	     <ExpandLess color="secondary"/> :
	     <ExpandMore color="secondary"/>}
	  </ListItem>
	  <Collapse className={classes.collapse} in={value} timeout="auto" unmountOnExit>
	    {children}
	  </Collapse>
	  <CustomDivider />
	</div>
    );
};

Sublist.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(Sublist);
