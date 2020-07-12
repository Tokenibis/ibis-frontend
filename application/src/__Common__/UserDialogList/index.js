import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import Link from '../CustomLink';
import { IbisConsumer } from '../../Context';
import QueryHelper from '../../__Common__/QueryHelper';
import ListView from '../../__Common__/ListView';

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
    button: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    buttonDisabled: {
	opacity: '50%',
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    dialogPaper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '70%',
    },
    dialogInner: {
	textAlign: 'center',
	padding: theme.spacing(1),
    },
    viewAllWrapper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    viewAll: {
	color: theme.palette.secondary.main,
	textAlign: 'right',
	textDecoration: 'none',
    },
});

const VARIANTS = {
    following: {
	display: 'Following',
	filter: '_Following',
    },
    follower: {
	display: 'Followers',
	filter: '_Followers',
    },
    like: {
	display: 'Likes',
	filter: '_LikeFor',
    },
    rsvp: {
	display: 'Going',
	filter: '_RsvpFor',
    },
}

const DEFAULT_COUNT = 25;

const query = loader('../../Static/graphql/app/IbisUserList.gql')

class IbisUserList_ extends Component {

    makeImage = (node) => {
	let { classes, onClick } = this.props;
	return onClick ? (
    	    <Avatar
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	        onClick={() => onClick(node)}
	    />
	):(
    	    <Avatar
		component={Link}
		to={node.person ?
		    `/Person/Person?id=${node.person.id}` :
		    `/Nonprofit/Nonprofit?id=${node.nonprofit.id}`}
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes, onClick } = this.props;
	return (
	    <div onClick={() => onClick(node)}>
  	      <Typography variant="body2" className={classes.title}>
  		{`${node.name}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
	);
    }

    render() {
	let { context, filterValue, count } = this.props;
	let make, variables;

	make = (data) => (
	    <ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		data={data}
	    />
	)

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
	    case '_Following':
		variables = {
		    followedBy: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Followers':
		variables = {
		    followerOf: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_LikeFor':
		variables = {
		    likeFor: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_RsvpFor':
		variables = {
		    rsvpFor: filterValue.split(':')[1],
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

	return (
	    <QueryHelper
		query={query}
		variables={variables}
		make={make}
	        scroll={'manual'}
	    />
	);
    };
};


IbisUserList_.propTypes = {
    classes: PropTypes.object.isRequired,
};

class UserDialogList extends Component {

    state = {
	opened: false,
    };

    handleOpen() {
	this.setState({ opened: true })
    };

    handleClose() {
	this.setState({ opened: false })
    };

    render() {
	let { classes, variant, count, node, hideZero } = this.props;
	let { opened } = this.state;

	return (
	    <div>
	      <Dialog
		  PaperProps={{ className: classes.dialogPaper }}
		  open={opened && count > 0}
		  onClose={() => this.handleClose()}
	      >
		<IbisConsumer>
		  {context => (
		      <IbisUserList_
			  classes={classes}
			  context={context}
			  filterValue={`${VARIANTS[variant].filter}:${node}`}
		      />
		  )}
		</IbisConsumer>
	      </Dialog>
	      {(hideZero && count === 0) ? (
		  <div style={{ height: 50 }}></div>
	      ):(
	       <Button onClick={() => this.handleOpen()}>
		 <Typography
		     variant="body2"
		     className={count === 0 ? classes.buttonDisabled : classes.button}
		   >
		   {`${VARIANTS[variant].display}: ${count}`}
		 </Typography>
	       </Button>
	      )}
	    </div>
	);
    };
};

export const FollowingVal = 'following';
export const FollowerVal = 'follower';
export const LikeVal = 'like';
export const RsvpVal = 'rsvp';
export const IbisUserList = withStyles(styles)(IbisUserList_);
export default withStyles(styles)(UserDialogList);
