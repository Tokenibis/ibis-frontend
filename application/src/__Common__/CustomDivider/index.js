import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    divider: {
	backgroundColor: theme.palette.light.main
    },
});

function CustomDivider({ classes }) {
    return (
	<div>
	  <Divider className={classes.divider}/>
	  <Divider className={classes.divider}/>
	</div>
    );
};

CustomDivider.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomDivider);
