import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Followicon from '@material-ui/icons/Add';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Person from '../Person';
import Filter from '../__Common__/Filter';

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
    }
})

const DEFAULT_COUNT = 25;

const QUERY_INNER = `
    edges {
  	node {
  	    id
       	    firstName
  	    lastName
	    username
	    balance
	    followerCount
	    followingCount
	    dateJoined
  	}
    }
`;

class PersonList extends Component {

    makeImage = (node) => {
	let { classes, handlePage } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handlePage(<Person id={node.id} />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.firstName.length) % 10}.jpg`)}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.name}>
  		{`${node.firstName} ${node.lastName}`}
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
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<Followicon />
	      </IconButton>
	      <Button onClick={(e) => handlePage(<Person id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  Profile
		</Typography>
	      </Button>
	    </div>
	);
    };

    render() {
	let { context, variant, filterValue, count } = this.props;
	let makeList, queryCustom, parser;

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		makeList = (data) => (
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
		makeList = (data) => (
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

	// start with QUERY_INNER and wrap the custom ("modified") portion of the query
	switch (filterValue.split(':')[0]) {

	    case 'All':
		// Order all by descending Ibis internal featured "score"
		queryCustom = `
		    allIbisUsers(isNonprofit: false, orderBy: "-score", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allIbisUsers)
		break;

	    case 'Following':
		// Show only ones being followed by the given user_id, ordered alphabetically
		queryCustom = `
		    ibisUser(id: "${context.userID}") {
			following(isNonprofit: false, orderBy: "first_name,last_name", first: ${count}) {
			    ${QUERY_INNER}
			}
		    }
		`;
		parser = (data) => (data.ibisUser.following)
		break;

	    case 'Followers':
		// Show only ones being followed by the given user_id, ordered alphabetically
		queryCustom = `
		    ibisUser(id: "${context.userID}") {
			follower(isNonprofit: false, orderBy: "first_name,last_name", first: ${count}) {
			    ${QUERY_INNER}
			}
		    }
		`;
		parser = (data) => (data.ibisUser.follower)
		break;

	    default:
		console.error('Unsupported filter option')
	}

	// wrap the custom query in the "query{}" object to create final valid graphql query
	let query = gql`
	    query {
		${queryCustom}
	    }
	`;

	return <QueryHelper query={query} parser={parser} makeList={makeList} {...this.props} />;
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
