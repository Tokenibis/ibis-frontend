import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import Link from '../../__Common__/CustomLink';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import EventFilter, { DefaultFilter } from './filter';
import SimpleEdgeMutation, { LikeVal, BookmarkVal, RsvpVal } from '../../__Common__/SimpleEdgeMutation';
import Truncated from '../../__Common__/Truncated';
import CustomDate, { PreciseVal } from '../../__Common__/CustomDate';

const styles = theme => ({
    root: {
	width: '100%',
    },
    avatar: {
	backgroundColor: 'white',
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    bubbles: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    bubble: {
	backgroundColor: 'white',
	height: 16,
	width: 16,
	margin: 2,
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    edgeMutations: {
	display: 'flex',
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    categoryIcon: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'None',
    },
    buttonWrapper: {
	width: '100%',
	textAlign: 'center',
	paddingTop: theme.spacing(2),
    },
    newButton: {
	width: '90%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(3),
    },
});

const DEFAULT_COUNT = 25;

const query = loader('../../Static/graphql/app/EventList.gql')

class EventList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;
	return (
    	    <Avatar
		component={Link}
		to={`/Organization/Organization?id=${node.user.id}`}
  		alt="Ibis"
    		src={node.user.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.title}>
  		{node.title}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
  		@{node.user.username} — <CustomDate variant={PreciseVal} date={node.date} />
  	      </Typography>
	    </div>
	);
    };

    makeMedia = (node) => {
	let { context } = this.props;

	let imageHeight = Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

	return (
  	    <CardMedia
		component={Link}
		to={`/Event/Event?id=${node.id}`}
	        style={{ height: imageHeight }}
    		image={node.image}
  		title={node.title}
  	    />
	);
    };

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      <Truncated text={node.description}/>
  	    </Typography>
	);
    };

    makeActions = (node) => {
	let { classes, context } = this.props;
	return (
	    <div className={classes.action}>
	      <div className={classes.edgeMutations}>
		<SimpleEdgeMutation
		    variant={RsvpVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasRsvp.edges.length === 1}
		/>
		<SimpleEdgeMutation
		    variant={BookmarkVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasBookmarked.edges.length === 1}
		/>
		<SimpleEdgeMutation
		    variant={LikeVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasLiked.edges.length === 1}
		/>
	      </div>
	      <Link to={`/Event/Event?id=${node.id}`}>
		<Typography variant="body2" className={classes.info} >
		  Details
		</Typography>
	      </Link>
	    </div>
	);
    };

    makeDecoration = (node) => {
	let { classes } = this.props;

	return (
	    <div className={classes.bubbles}>
	      {node.commenterRecursive.edges.slice(0, 3).reverse().map(item => (
		  <Avatar
  		      alt="bubble"
    		      src={item.node.avatar}
    		      className={classes.bubble}
		  />
	      ))}
	    </div>
	)
    }

    render() {
	let { classes, context, minimal, filterValue, count } = this.props;
	let infiniteScroll, make, variables;

	if (minimal) {
	    // hide icons/pictures and scroll button; intended for small partial-page lists
	    infiniteScroll = false;
	    make = (data) => (
		<ListView
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeMedia={this.makeMedia}
		    makeActions={this.makeActions}
		    data={data}
		/>
	    )
	} else {
	    // show everything; intended for full-page lists
	    infiniteScroll = true;
	    make = (data) => (
		<ListView
		    expandedAll
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeMedia={this.makeMedia}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    makeDecoration={this.makeDecoration}
		    data={data}
		/>
	    )
	}

	// set default values if needed
	filterValue = filterValue ? filterValue : DefaultFilter;
	count = count ? count: DEFAULT_COUNT;

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Mine':
		variables = {
		    user: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case 'All':
		variables = {
		    orderBy: "date",
		    first: count,
		}
		break;
	    case 'Featured':
		variables = {
		    orderBy: "-score",
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    byFollowing: context.userID,
		    orderBy: "date",
		    first: count,
		}
		break;
	    case 'Bookmarked':
		variables = {
		    bookmarkBy: context.userID,
		    orderBy: "date",
		    first: count,
		}
		break;
	    case 'Going':
		variables = {
		    rsvpBy: context.userID,
		    orderBy: "date",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "date",
		    first: count,
		}
		break;
	    case '_Host':
		variables = {
		    user: filterValue.split(':')[1],
		    orderBy: "date",
		    first: count,
		}
		break;
	    case `_Going`:
		variables = {
		    rsvpBy: filterValue.split(':')[1],
		    orderBy: "date",
		    first: count,
		}
		break;
	    case `_Calendar`:
		variables = {
		    beginDate: filterValue.split(/:(.+)/)[1],
		    orderBy: "date",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	// show events for an hour into the event
	if (!Object.keys(variables).includes('beginDate')) {
	    variables.beginDate = (new Date((new Date()).getTime() - 60 * 60 * 1000)).toISOString()
	}

	return (
	    <div className={classes.root}>
	      {!minimal && context.userType === 'Organization' &&
	       <div className={classes.buttonWrapper}>
		 <Button
		     component={Link}
		     to={`/Event/EventMutate`}
		     className={classes.newButton}
		   >
		   New Event
		 </Button>
	       </div>
	      }
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={make}
		  scroll={infiniteScroll ? 'infinite' : null}
	      />
	    </div>
	);
    };
};

EventList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export { EventFilter };
export default withStyles(styles)(EventList);
