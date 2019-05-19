import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    quote: {
	textAlign: 'center',
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing.unit,
    },
    author: {
	textAlign: 'right',
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    }
});

function Quote({ classes }) {
    return (
	<div>
	<Typography variant="body2" className={classes.quote}>
	  "One of the most difficult things to do is not to change society, but to change yourself."
	</Typography>
	<Typography variant="body2" className={classes.author}>
	  -- Nelson Mandela
	</Typography>
	</div>										    
    )
};

Quote.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quote);
