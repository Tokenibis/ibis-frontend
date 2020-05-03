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
import CustomDate from '../../__Common__/CustomDate';
import { IbisConsumer } from '../../Context';

const styles = theme => ({
    root: {
	width: '100%',
    },
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
    postButton: {
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

const query = loader('../../Static/graphql/operations/PostList.gql')

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
  		@{node.user.username} - <CustomDate date={node.created} />
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
	    <Typography variant="body2">
  	      <Truncated text={node.description}/>
	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	
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
		<SimpleEdgeMutation
		    variant={BookmarkVal}
		    user={context.userID}
		    target={node.id}
		    initial={node.hasBookmarked.edges.length === 1}
		    hide={context.userID === node.user.id}
		/>
	      </div>
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Post?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		Go to page
	      </Typography>
	    </div>
	);
    };

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
		data={data}
		/>
	    )
	}

	// set default values if needed
	filterValue = filterValue ? filterValue : 'All'
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Mine':
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
	    case 'Bookmarked':
		variables = {
		    bookmarkBy: context.userID,
		    orderBy: "-created",
		    first: count,
		}
		break;
	    case 'Classic':
		variables = {
		    orderBy: "-like_count",
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
	    <div className={classes.root}>
	      {!minimal && context.userType === 'person' &&
	       <div className={classes.buttonWrapper}>
		 <Button
		     component={Link}
		     prefix={1}
		     to={`PostCreate`}
		     className={classes.postButton}
		   >
		   New Post
		 </Button>
	       </div>
	      }
	      <QueryHelper
		  query={query}
		  variables={variables}
		  make={make}
		  infiniteScroll={infiniteScroll}
	      />
	    </div>
	);
    };

};

PostList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function PostFilter(props) {
    return (
	<IbisConsumer>
	  {context => (
	      context.userType === 'person' ?
	      <Filter options={['Mine', 'All', 'Following', 'Bookmarked']} {...props} />:
	      <Filter options={['All', 'Following', 'Bookmarked']} {...props} />
	  )}
	</IbisConsumer> 
    )
}

export { PostFilter };
export default withStyles(styles)(PostList);
