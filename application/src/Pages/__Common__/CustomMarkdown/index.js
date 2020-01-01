import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown';

import Confirmation from '../Confirmation';

const config = require('../../../config.json');

const styles = theme => ({
    message: {
	color: theme.palette.tertiary.main,
    },
    link: {
	textDecoration: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    linkInert: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
});

function CustomMarkdownLink({ classes, safe, nolink, ...other }) {

    let followLink = (destination) => {
	window.location = destination;
    }

    let domain = (new URL(config.ibis.app)).hostname;
    let isExternal;

    try {
	let destinationDomain = (new URL(other.href)).hostname
	isExternal = destinationDomain && destinationDomain !== domain
    } catch (error) {
	isExternal = false;
    }

    if (nolink) {
	return <span className={classes.linkInert} {...other} />;
    }

    return (
	<Confirmation
	  onClick={() => (followLink(other.href))}
	  message={`You're about to __leave the app__ for a user-posted link to ${other.href}. Are you sure you want to continue?`}
	  autoconfirm={safe || !isExternal}
	>
	  <span className={classes.link} {...other} />
	</Confirmation>
    );
};

function CustomMarkdown({ classes, source, safe, nolink, ...other }) {
    return (
	<Typography variant="body2" className={classes.message}>
	  <ReactMarkdown
	      source={source}
	      renderers={{
		  link: props => (<CustomMarkdownLink classes={classes} safe={safe} nolink={nolink} {...props}/>),
		  linkReference: props => (<CustomMarkdownLink classes={classes} safe={safe} {...props}/>),
	      }}
	  {...other}
	  />
	</Typography>
    );
};

export default withStyles(styles)(CustomMarkdown);
