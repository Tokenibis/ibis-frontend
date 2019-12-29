import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import CardMedia from '@material-ui/core/CardMedia';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import EventFilter from './filter';
import SimpleEdgeMutation, { LikeVal, BookmarkVal, RsvpVal } from '../__Common__/SimpleEdgeMutation';
import Truncated from '../__Common__/Truncated';

const removeMd = require('remove-markdown');

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
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
    }
});

const DEFAULT_COUNT = 25;

const query = loader('../../Static/graphql/operations/EventList.gql')

class EventList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;
	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to={`Nonprofit?id=${node.user.nonprofit.id}`}
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
  	      <Typography variant="body2" className={classes.name}>
  		{node.title}
  	      </Typography>
  	      <Typography variant="body2" className={classes.username}>
  		{node.user.name} - {new Date(node.date).toDateString()}
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
		prefix={1}
		to={`Event?id=${node.id}`}
	        style={{ height: imageHeight }}
    		image={node.image}
  		title={node.title}
  	    />
	);
    };

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      <Truncated text={removeMd(node.description)}/>
  	    </Typography>
	);
    };

    makeActions = (node) => {
	let { classes, context } = this.props;
	return (
	    <div className={classes.action}>
	      <div>
		<SimpleEdgeMutation
		    variant={LikeVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasLiked.edges.length === 1}
		/>
		<SimpleEdgeMutation
		    variant={BookmarkVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasLiked.edges.length === 1}
		/>
		<SimpleEdgeMutation
		    variant={RsvpVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasRsvp.edges.length === 1}
		/>
	      </div>
	      <Link prefix={1} to={`Event?id=${node.id}`}>
		<Typography variant="body2" className={classes.info} >
		  Go to page
		</Typography>
	      </Link>
	    </div>
	);
    };

    render() {
	let { context, variant, filterValue, count } = this.props;
	let infiniteScroll, make, variables;

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		infiniteScroll = false;
		make = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data}
		    {...this.props}
		    />
		)
		break;

	    default:
		// show everything; intended for full-page lists
		infiniteScroll = true;
		make = (data) => (
		    <ListView
			expandedAll
			scrollButton
			makeImage={this.makeImage}
			makeLabel={this.makeLabel}
			makeMedia={this.makeMedia}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data}
		    {...this.props}
		    />
		)
	};

	// set default values if needed
	filterValue = filterValue ? filterValue : 'All'
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'All':
		variables = {
		    orderBy: "-date",
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
		    orderBy: "-date",
		    first: count,
		}
		break;
	    case 'Going':
		variables = {
		    rsvpBy: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "-date",
		    first: count,
		}
		break;
	    case '_Host':
		variables = {
		    byUser: filterValue.split(':')[1],
		    orderBy: "-date",
		    first: count,
		}
		break;
	    case `_Going`:
		variables = {
		    rsvpBy: filterValue.split(':')[1],
		    orderBy: "-date",
		    first: count,
		}
		break;
	    case `_Calendar`:
		variables = {
		    beginDate: filterValue.split(/:(.+)/)[1],
		    orderBy: "-date",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <QueryHelper
		query={query}
		variables={variables}
		make={make}
		infiniteScroll={infiniteScroll}
	    {...this.props}
	    />
	);
    };
};

EventList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export { EventFilter };
export default withStyles(styles)(EventList);
