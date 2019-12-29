import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from "axios";

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

class Quote extends Component {

    state = {
	quote: '',
	author: '',
    }

    componentDidMount() {
	axios('/ibis/quote/', {
	    withCredentials: true,
	}).then(response => {
	    this.setState({ quote: response.data.quote, author: response.data.author });
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})

    };

    render() {
	let { classes } = this.props;
	let { quote, author } = this.state;

	return (
	    <div>
	      <Typography variant="body2" className={classes.quote}>
		{quote}
	      </Typography>
	      <Typography variant="body2" className={classes.author}>
		{author && `-- ${author}`}
	      </Typography>
	    </div>										    
	);
    }
};

Quote.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Quote);
