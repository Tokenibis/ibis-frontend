import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

function CustomItem({label, value, icon, children, onClick}) {
    return (
	<div>
	  <ListItem button onClick={onClick}>
	    <ListItemIcon>
	      {icon}
	    </ListItemIcon>
	    <ListItemText primary={label} />
	    {value ?
	     <ExpandLess color="secondary"/> :
	     <ExpandMore color="secondary"/>}
	  </ListItem>
	  <Collapse in={value} timeout="auto" unmountOnExit>
	    {children}
	  </Collapse>
	  <Divider />
	</div>
    );
};

CustomItem.propTypes = {
    label: PropTypes.node.isRequired,
    value: PropTypes.bool.isRequired,
    icon: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default CustomItem;
