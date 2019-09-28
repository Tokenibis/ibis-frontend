import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import SimpleEdgeMutation, { FollowVal } from '../__Common__/SimpleEdgeMutation';

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
    body: {
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(3),
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    }
})

const DEFAULT_COUNT = 25;

const QUERY = gql`
    query PersonList($self: String $search: String $followedBy: String $followerOf: String $orderBy: String $first: Int $after: String) {
	allPeople(search: $search followedBy: $followedBy followerOf: $followerOf orderBy: $orderBy first: $first after: $after) {
	    edges {
  		node {
		    id
		    name
		    username
		    avatar
		    balance
		    followerCount
		    followingCount
		    dateJoined
		    isFollowing: follower(id: $self) {
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

class PersonList extends Component {

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to={`Person?id=${node.id}`}
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.name}>
  		{`${node.name}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.username}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.body}>
		{`Date joined: ${new Date(node.dateJoined).toLocaleDateString()}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Number of followers: ${node.followerCount}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Number following: ${node.followingCount}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Current Balance: $${node.balance}`}
  	      </Typography>
	    </div>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	return (
	    <div className={classes.action}>
	      <SimpleEdgeMutation
		  variant={FollowVal}
		  user={context.userID}
		  target={node.id}
		  initial={node.isFollowing.edges.length === 1}
	      />
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Person?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		Profile
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
	    case 'All':
		variables = {
		    orderBy: '-date_joined',
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    followedBy: context.userID,
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case 'Followers':
		variables = {
		    followerOf: context.userID,
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "firstname,lastname",
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


PersonList.propTypes = {
    classes: PropTypes.object.isRequired,
    filterValue: PropTypes.string.isRequired,
};

function PersonFilter(props) {
    return <Filter options={['All', 'Following', 'Followers']} {...props} />;
}

export { PersonFilter };
export default withStyles(styles)(PersonList);
