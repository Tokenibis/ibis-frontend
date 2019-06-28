import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    root: {
	display: 'flex',
	justifyContent: 'space-between',
    },
});

function AddButton({ classes, onClick, label }) {
    return (
	<div className={classes.root}>
	  <AddIcon />
	  <Typography>
	    {label}
	  </Typography>
	</div>
    );
};

AddButton.propTypes = {
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default withStyles(styles)(AddButton);
