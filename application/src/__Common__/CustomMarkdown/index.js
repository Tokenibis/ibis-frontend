import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import CircularProgress from '@material-ui/core/CircularProgress';

import Confirmation from '../Confirmation';

const config = require('../../__config__.json');

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
    image: {
	maxWidth: '100%',
    },
    videoWrapper: {
	position: 'relative',
	paddingTop: '56.25%',
    },
    video: {
	position: 'absolute',
	top: 0,
	left: 0,
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

class CustomMarkdownImage extends Component {
    state = {
	tryVideo: false,
	videoReady: false,
    };

    render() {
	let { classes, src, alt } = this.props;
	let { tryVideo, videoReady } = this.state;

	if (!tryVideo) {
	    return (
		<img
		    className={classes.image}
		    src={src}
		    alt={alt}
		    onError={() => this.setState({ tryVideo: true })}
		/>
	    );
	} else {
	    return (
		<div className={classes.videoWrapper}>
		  {!videoReady &&
  		   <Grid
		       style={{height: '100%', position: 'absolute', top: 0 }}
		       container direction="column" justify="center" alignItems="center" >
		     <CircularProgress/>
		   </Grid>
		  }
		  <ReactPlayer
		      className={classes.video}
		      onReady={() => this.setState({ videoReady: true })}
		      controls
		      url={src}
		      width="100%"
		      height="100%"
		  />
		</div>
	    );
	}
    };
};

function CustomMarkdown({ classes, source, safe, noLink, noClick, mention, messageProps, ...other }) {
    if (mention) {
	Object.keys(mention).forEach((x) => {
	    source = ` ${source} `.replace(
		new RegExp(`(\\W)(@${x})(\\W)`, 'g'),
		`$1[$2](#/${mention[x][1]}/${mention[x][1]}?id=${mention[x][0]})$3`,
		'g',
	    ).slice(1, -1)
	});
    }

    source = source.replace('_](', '\\_](');

    return (
	<Typography variant="body2" className={messageProps ? messageProps : classes.message}>
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
		  image: props => (
		      <CustomMarkdownImage
			  classes={classes}
		          src={props.src}
		          alt={props.alt}
		      />
		  ),
	      }}
	  {...other}
	  />
	</Typography>
    );
};

export default withStyles(styles)(CustomMarkdown);
