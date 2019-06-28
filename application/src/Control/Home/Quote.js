import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    quote: {
	textAlign: 'center',
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(1),
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
	  "What birds can have their bills more peculiarly formed than the ibis, the spoonbill, and the heron?"
	</Typography>
	<Typography variant="body2" className={classes.author}>
	  -- Alfred Russel Wallace
	</Typography>
	</div>										    
    )
};

Quote.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quote);
