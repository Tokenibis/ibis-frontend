import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';
import Filter from '../../__Common__/Filter';
import Link from '../../__Common__/CustomLink';
import SimpleEdgeMutation, { LikeVal, BookmarkVal } from '../../__Common__/SimpleEdgeMutation';
import Truncated from '../../__Common__/Truncated';
import CustomDivider from '../../__Common__/CustomDivider';
import CustomDate from '../../__Common__/CustomDate';
import { IbisConsumer } from '../../Context';

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
	paddingLeft: theme.spacing(1),
    },
    bubble: {
	backgroundColor: 'white',
	height: 16,
	width: 16,
	margin: 2,
	filter: 'grayscale(100%)',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.tertiary.main,
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
    reward: {
	fontWeight: 'bold',
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
    likeBookmark: {
	display: 'flex',
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
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    },
    buttonWrapper: {
	width: '100%',
	textAlign: 'center',
	paddingTop: theme.spacing(2),
    },
    activityButton: {
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
const DEFAULT_FILTER = 'All';

const query = loader('../../Static/graphql/app/ActivityList.gql')

class ActivityList extends Component {

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		to={`/bot?id=${node.user.id}`}
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
  	      <Typography
		  variant="body2"
		  className={classes.title}
	      >
  		{node.title}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
  		@{node.user.username} — <CustomDate date={node.created} />
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	let { classes, context } = this.props;

	let reward_str = node.active ? (
	    Math.round(node.rewardMin/100) === Math.round((node.rewardMin + node.rewardRange)/100) ? (
		`Reward: $${Math.round(node.rewardMin/100)}. `
	    ):(
		`Reward: $${Math.round(node.rewardMin/100)}-${Math.round((node.rewardMin + node.rewardRange)/100)}. `
	    )
	):(
	    'Activity Finished. '
	)

	return (
	    <Typography variant="body2">
  	      <span className={classes.reward}>{reward_str}</span>
	      {node.active && <Truncated text={node.description}/>}
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	
	return (
	    <div className={classes.action}>
	      <div className={classes.likeBookmark}>
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
		    hide={context.userID === node.user.id}
		/>
	      </div>
	      <Typography
		  component={Link}
		  to={`/activity?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
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
	let { classes, context, minimal, filterValue, count } = this.props;
	let infiniteScroll, make, variables;

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
	}

	// set default values if needed
	filterValue = filterValue ? filterValue : DEFAULT_FILTER;
	count = count ? count: DEFAULT_COUNT;

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Mine':
		variables = {
		    user: context.userID,
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    byFollowing: context.userID,
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    case 'All':
		variables = {
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    case 'Bookmarked':
		variables = {
		    bookmarkBy: context.userID,
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    case 'Classic':
		variables = {
		    orderBy: "-active,-like_count",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    case '_User':
		variables = {
		    user: filterValue.split(':')[1],
		    orderBy: "-active,-created",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <div className={classes.root}>
	      {!minimal && context.userType === 'bot' &&
	       <div className={classes.buttonWrapper}>
		 <Button
		     component={Link}
		     to={`/activity-mutate`}
		     className={classes.activityButton}
		   >
		   New Activity
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

ActivityList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function ActivityFilter(props) {
    return (
	<IbisConsumer>
	  {context => (
	      <Filter
		  options={context.userType === 'bot' ?
			   ['All', 'Following', 'Mine', 'Bookmarked'] :
			   ['All', 'Following', 'Bookmarked']
		  }
		  defaultVal={DEFAULT_FILTER}
	      {...props}
	      />
	  )}
	</IbisConsumer> 
    )
}

export { ActivityFilter };
export default withStyles(styles)(ActivityList);
