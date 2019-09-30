import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ToIcon from '@material-ui/icons/ArrowRightAlt';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import Link from '../../__Common__/CustomLink';
import TransactionCategoryIcon from '../__Common__/TransactionCategoryIcon';
import SimpleEdgeMutation, { LikeVal } from '../__Common__/SimpleEdgeMutation';

const styles = theme => ({
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
    query TransactionList($self: String $search: String $byUser: String $byFollowing: String $orderBy: String $first: Int $after: String) {
	allTransactions(search: $search byUser: $byUser byFollowing: $byFollowing orderBy: $orderBy first: $first after: $after) {
	    edges {
  		node {
		    id
		    amount
		    description
		    created
		    likeCount
		    category {
			id
		    }
		    target {
			id
			name
		    }
		    user {
			id
			name
		    }
		    hasLiked: like(id: $self) {
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

class TransactionList extends Component {

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
	    <Link prefix={1} to={`Transaction?id=${node.id}`}>
	      <IconButton>
		<TransactionCategoryIcon
		    id={node.category.id}
		    className={classes.categoryIcon}
		/>
	      </IconButton>
	    </Link>
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2" className={classes.label}>
	      {`${node.user.name}`}
	      {<ToIcon className={classes.toIcon} />}
	      {`${node.target.name}`}
	    </Typography>
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
	return (
	    <div className={classes.action}>
	      <SimpleEdgeMutation
		  variant={LikeVal}
		  user={context.userID}
		  target={node.id}
		  initial={node.hasLiked.edges.length === 1}
	      />
	      <Typography variant="body2" className={classes.amount}>
		{`$${(node.amount/100).toFixed(2)}`}
	      </Typography>
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Transaction?id=${node.id}`}
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
	filterValue = filterValue ? filterValue : 'Following'
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
	    case 'Public':
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

TransactionList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function TransactionFilter(props) {
    return <Filter options={['Me', 'Following', 'Public']} {...props} />;
}

export { TransactionFilter };
export default withStyles(styles)(TransactionList);
