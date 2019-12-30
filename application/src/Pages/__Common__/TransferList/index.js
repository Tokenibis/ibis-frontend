import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import Avatar from '@material-ui/core/Avatar';

import Link from '../../../__Common__/CustomLink';
import QueryHelper from "../QueryHelper";
import ListView from '../ListView';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import Truncated from '../Truncated';

const removeMd = require('remove-markdown');

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    toIcon: {
	marginBottom: -7,
	marginLeft: 4,
	marginRight: 4,
    },
    title: {
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
    },
    commentCount: {
	color: theme.palette.tertiary.main,
	fontSize: 14,
    },
    commentCountIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.tertiary.main,
    },
});

const DEFAULT_COUNT = 25;

class TransferList extends Component {

    makeImage = (node) => {
	let { classes } = this.props;

	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to={`Person?id=${node.user.person.id}`}
  		alt="Ibis"
    		src={node.user.avatar}
    		className={classes.avatar}
	    />
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		{`${node.user.name}`}
		{<ToIcon className={classes.toIcon} />}
		{node.target.name}
	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
	    <Typography variant="body2">
  	      <Truncated text={removeMd(node.description)}/>
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context, variant } = this.props;
	return (
	    <div className={classes.action}>
	      <SimpleEdgeMutation
		  variant={LikeVal}
		  user={context.userID}
		  target={node.id}
		  initial={node.hasLiked.edges.length === 1}
		  hide={context.userID === node.user.person.id}
	      />
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`${variant === 'donation' ? 'Donation' : 'Transaction'}?id=${node.id}`}
		  variant="body2"
		  className={classes.details}
	      >
		Go to page
	      </Typography>
	    </div>
	);
    };

    render() {
	let { context, minimal, variant, filterValue, count } = this.props;
	let infiniteScroll, make, variables;

	let query;

	if (variant === 'donation') {
	    query = loader('../../../Static/graphql/operations/DonationList.gql')
	} else {
	    query = loader('../../../Static/graphql/operations/TransactionList.gql')
	}

	// variant does not affect the content, only the visually displayed information
	if (minimal) {
	    // hide icons/pictures and scroll button; intended for small partial-page lists
	    infiniteScroll = false;
	    make = (data) => (
		<ListView
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data}
		/>
	    )
	} else {
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
		query={query}
		variables={variables}
		make={make}
		infiniteScroll={infiniteScroll}
	    />
	);
    };
};

TransferList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';
export default withStyles(styles)(TransferList);
