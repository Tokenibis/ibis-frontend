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

function CustomMarkdownLink({ classes, safe, noLink, noClick, ...other }) {

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

    if (noLink) {
	return <span className={classes.linkInert} {...other} />;
    }

    return (
	<Confirmation
	  onClick={() => (!noClick && followLink(other.href))}
	  message={`You're about to __leave the app__ for a user-posted link to ${other.href}. Are you sure you want to continue?`}
	  autoconfirm={noClick || safe || !isExternal}
	>
	  <span className={classes.link} {...other} />
	</Confirmation>
    );
};

function CustomMarkdown({ classes, source, safe, noLink, noClick, ...other }) {
    return (
	<Typography variant="body2" className={classes.message}>
	  <ReactMarkdown
	      source={source}
	      renderers={{
		  link: props => (
		      <CustomMarkdownLink
			  classes={classes}
		          safe={safe}
		          noLink={noLink}
		          noClick={noClick}
		      {...props}
		      />
		  ),
		  linkReference: props => (
		      <CustomMarkdownLink
			  classes={classes}
		          safe={safe}
		          noLink={noLink}
		          noClick={noClick}
		      {...props}
		      />
		  ),
	      }}
	  {...other}
	  />
	</Typography>
    );
};

export default withStyles(styles)(CustomMarkdown);
