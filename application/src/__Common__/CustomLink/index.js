import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
    root: {
	textDecoration: 'none',
	color: 'inherit',
	overflow: 'auto',
    }
});

function CustomLink(props) {
    let { children, classes, relative, to, prefix, ...other } = props;

    if (prefix) {
	to = '/' + window.location.hash.split('/').splice(1, prefix).join('/') + '/' + to;
    }

    return (
	<Link className={classes.root} to={to} {...other}>
	  {children}
	</Link>
    )
}

export default withStyles(styles)(CustomLink);
