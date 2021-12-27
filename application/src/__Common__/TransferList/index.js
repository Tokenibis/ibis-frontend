import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import Link from '../CustomLink';
import QueryHelper from "../QueryHelper";
import ListView from '../ListView';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import Truncated from '../Truncated';

const styles = theme => ({
    root: {
	width: '100%',
    },
    bold: {
	fontWeight: 'bold',
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
	paddingLeft: theme.spacing(1),
    },
    bubble: {
	backgroundColor: 'white',
	height: 12,
	width: 12,
	margin: 2,
	filter: 'grayscale(100%)',
 	borderStyle: 'solid',
  	borderWidth: '1px',
  	borderColor: theme.palette.tertiary.main,
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
    subtitle: {
	color: theme.palette.tertiary.main,
	fontStyle: 'italic',
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
    body: {
	paddingLeft: theme.spacing(6),
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    likeBookmark: {
	display: 'flex',
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
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
	marginBottom: theme.spacing(1),
    },
});

const DEFAULT_COUNT = 25;
const DEFAULT_FILTER = 'All';

class TransferList extends Component {

    makeImage = (node) => {
	let { classes, variant } = this.props;

	return (
    	    <Avatar
		component={Link}
		to={variant === 'donation' ?
		    `/person?id=${node.user.id}` :
		    `/bot?id=${node.user.id}`}
  		alt="Ibis"
    		src={node.user.avatar}
    		className={classes.avatar}
	    />
	);
    };

    makeLabel = (node) => {
	let { classes, variant } = this.props;
	return (
	    <div>
	      <Typography variant="body2" className={classes.title}>
		{`${node.user.name}`}
		{<ToIcon className={classes.toIcon} />}
		{node.target.name}
	      </Typography>
	      {variant === 'donation' && node.grantdonationSet && node.grantdonationSet.edges.length === 1 && (
		  <Typography variant="body2" className={classes.subtitle}>
		    {`Your grant funded $${(node.grantdonationSet.edges[0].node.amount/100).toFixed(2)} (${Math.round(100 * Math.min(1, node.grantdonationSet.edges[0].node.amount/node.amount))}%)`}
		  </Typography>
	      )}
	    </div>
	);
    }

    makeBody = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2" className={classes.body}>
  	      <Truncated text={node.description}/>
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context, variant } = this.props;
	return (
	    <div className={classes.action}>
	      <div className={classes.likeBookmark}>
		<SimpleEdgeMutation
		    variant={LikeVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasLiked.edges.length === 1}
		    hide={context.userID === node.user.id}
		/>
	      </div>
	      <Typography
		  component={Link}
		  to={`${variant === 'donation' ? '/donation' : '/reward'}?id=${node.id}`}
		  variant="body2"
		  className={classes.details}
	      >
		Details
	      </Typography>
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
	let { classes, context, minimal, variant, filterValue, count } = this.props;
	let infiniteScroll, make, variables;

	let query;

	if (variant === 'donation') {
	    query = loader('../../Static/graphql/app/DonationList.gql')
	} else {
	    query = loader('../../Static/graphql/app/RewardList.gql')
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
		    expandedAll
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    makeDecoration={this.makeDecoration}
		    data={data}
		/>
	    )
	};

	// set default values if needed
	filterValue = filterValue ? filterValue : DEFAULT_FILTER;
	count = count ? count: DEFAULT_COUNT;

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Mine':
		variables = {
		    withUser: context.userID,
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
	    case 'Bookmarked':
		variables = {
		    bookmarkBy: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case 'Grant':
		variables = {
		    withGrant: filterValue.split(':')[1],
		    includeGrant: true,
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
		    withUser: filterValue.split(':')[1],
		    orderBy: "-created",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <div className={classes.root}>
	      {!minimal && ((context.userType === 'person' && variant === 'donation') ||
			    (context.userType === 'bot' && variant === 'reward')) && (
		  <div className={classes.buttonWrapper}>
		    <Button
			component={Link}
			to={variant === 'donation' ? '/organization-list': '/person-list'}
			className={classes.newButton}
		      >
		      {variant === 'donation' ? 'New Donation' : 'New Reward'}
		    </Button>
		  </div>
	      )}
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

TransferList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const RewardVal = 'reward';
export const DefaultFilter = 'All';
export default withStyles(styles)(TransferList);
