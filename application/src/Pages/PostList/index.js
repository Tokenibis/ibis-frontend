
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import Avatar from '@material-ui/core/Avatar';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import Link from '../../__Common__/CustomLink';
import VoteMutation, { NeutralVal, UpvoteVal, DownvoteVal } from '../__Common__/VoteMutation';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    categoryIcon: {
	color: theme.palette.secondary.main,
	padding: 0,
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    label: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    }
});

const DEFAULT_COUNT = 25;

const QUERY = gql`
    query PostList($self: String $search: String $byUser: String $byFollowing: String $orderBy: String $first: Int $after: String) {
	allPosts(search: $search byUser: $byUser byFollowing: $byFollowing orderBy: $orderBy first: $first after: $after) {
	    edges {
  		node {
		    id
		    title
		    created
		    description
		    voteDifference
		    user {
			id
			name
			avatar
			person {
			    id
			}
		    }
		    hasUpvoted: upvote(byUser: $self) {
			edges {
			    node {
				id
			    }
			}
		    }
		    hasDownvoted: downvote(byUser: $self) {
			edges {
			    node {
				id
			    }
			}
		    }
		}
		cursor
	    }
	    pageInfo {
		hasNextPage
	    }
	}
    }
`;

class PostList extends Component {

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to={`Person?id=${node.user.person.id}`}
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
  		{new Date(node.created).toDateString()}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
	    <Typography variant="body2">
	      {node.description}
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	
	let initial_vote;
	
	if (node.hasUpvoted.edges.length === 0 && node.hasDownvoted.edges.length === 0) {
	    initial_vote = NeutralVal;
	} else if (node.hasUpvoted.edges.length !== 0) {
	    initial_vote = UpvoteVal;
	} else if (node.hasDownvoted.edges.length !== 0) {
	    initial_vote = DownvoteVal;
	} else {
	    console.error('Something is wrong; we should not have simultaneously up/downvotes');
	}

	return (
	    <div className={classes.action}>
	      <VoteMutation
		  user={context.userID}
		  target={node.id}
		  initial={initial_vote}
		  diff={node.voteDifference}
	      />
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Post?id=${node.id}`}
		  variant="body2"
		  className={classes.details}
	      >
		Details
	      </Typography>
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
		    scrollButton
		    expandedAll
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
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
	    case 'Me':
		variables = {
		    byUser: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    byFollowing: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case 'All':
		variables = {
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case '_User':
		variables = {
		    byUser: filterValue.split(':')[1],
		    orderBy: "-created",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <QueryHelper
		query={QUERY}
		variables={variables}
		make={make}
		infiniteScroll={infiniteScroll}
	    {...this.props}
	    />
	);
    };

};

PostList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function PostFilter(props) {
    return <Filter options={['Me', 'Following', 'All']} {...props} />;
}

export { PostFilter };
export default withStyles(styles)(PostList);
