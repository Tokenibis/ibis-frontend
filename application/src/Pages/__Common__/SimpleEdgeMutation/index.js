/*
   
   Helper component for rendering interactive Simple Edge Mutation
   Icons. Simple edge mutations currently consist of follow, like,
   bookmark, and rsvp actions. These are simple true/false edges
   between an ibisUser (props.user) and some other ibis model object
   (props.target). The React component provides a hard-coded
   toggleable icon for each variant and graphql mutation functionality
   to interactively update the value of the edge to the remote server.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
import IconButton from '@material-ui/core/IconButton';
import FollowOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import FollowFilledIcon from '@material-ui/icons/HowToReg';
import LikeOutlinedIcon from '@material-ui/icons/FavoriteBorder';
import LikeFilledIcon from '@material-ui/icons/Favorite';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkFilledIcon from '@material-ui/icons/Bookmark';
import RsvpOutlinedIcon from '@material-ui/icons/CalendarToday';
import RsvpFilledIcon from '@material-ui/icons/EventAvailable';

import Confirmation from '../Confirmation';

const styles = theme => ({
    buttonWrapper: {
	display: 'flex' 
    },
    stat: {
	fontSize: 12,
	color: theme.palette.secondary.main,
	marginTop: theme.spacing(1.5),
	marginLeft: theme.spacing(-1),
	marginRight: theme.spacing(-0.8),
    },
});

const VARIANTS = {
    follow: {
	createMutation: loader('../../../Static/graphql/operations/FollowCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/FollowDelete.gql'),
	trueIcon: <FollowFilledIcon color="secondary" />,
	falseIcon: <FollowOutlinedIcon color="secondary" />,
	autoconfirm: false,
	messageCreate: 'Are you sure you want to follow this user?',
	messageDelete: 'Are you sure you want to unfollow this user?',
    },
    like: {
	createMutation: loader('../../../Static/graphql/operations/LikeCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/LikeDelete.gql'),
	trueIcon: <LikeFilledIcon color="secondary" />,
	falseIcon: <LikeOutlinedIcon color="secondary" />,
	autoconfirm: true,
    },
    bookmark: {
	createMutation: loader('../../../Static/graphql/operations/BookmarkCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/BookmarkDelete.gql'),
	trueIcon: <BookmarkFilledIcon color="secondary" />,
	falseIcon: <BookmarkOutlinedIcon color="secondary" />,
	autoconfirm: true,
    },
    rsvp: {
	createMutation: loader('../../../Static/graphql/operations/RsvpCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/RsvpDelete.gql'),
	trueIcon: <RsvpFilledIcon color="secondary" />,
	falseIcon: <RsvpOutlinedIcon color="secondary" />,
	autoconfirm: false,
	messageCreate: 'Are you sure you want to RSVP to this event?',
	messageDelete: 'Are you sure you want to cancel your RSVP to this event?',
    },
};


class SimpleEdgeMutation extends Component {
    
    constructor({ initial }) {
	super();
	this.state = { current: initial, loading: false, confirm: false };
    }

    handleCreate() {
	let { client, variant, user, target, initial, countCallback } = this.props;

	return client.mutate({
	    mutation: VARIANTS[variant].createMutation,
	    variables: { user, target }
	}).then(response => {
	    this.setState({
		current: response.data[Object.keys(response.data)[0]].state,
		loading: false,
		confirm: true,
	    });
	    countCallback(initial ? 0 : 1);
	}).catch(error => {
	    console.log(error);
	});
    }

    handleDelete() {
	let { client, variant, user, target, initial, countCallback } = this.props;

	return client.mutate({
	    mutation: VARIANTS[variant].deleteMutation,
	    variables: { user, target }
	}).then(response => {
	    this.setState({
		current: response.data[Object.keys(response.data)[0]].state,
		loading: false,
		confirm: true,
	    });
	    countCallback(initial ? -1 : 0);
	}).catch(error => {
	    console.log(error);
	});
    }

    render() {
	let { classes, initial, variant, count, hide } = this.props
	let { current } = this.state

	if (hide) {
	    return (
		<div style={{ height: 50}}></div>
	    );
	}

	let liveCount = count;
	if (current !== initial) {
	    liveCount += current ? 1 : -1;
	}

	if (current) {
	    return (
		<Confirmation
		  autoconfirm={VARIANTS[variant].autoconfirm}
		  onClick={() => this.handleDelete()}
		  message={VARIANTS[variant].messageDelete}
		  progress
		>
		  <div className={classes.buttonWrapper}>
		    <IconButton>
		      {VARIANTS[variant].trueIcon}
		    </IconButton>
		    {count !== undefined && 
		     <div className={classes.stat}>
		       ({liveCount})
		     </div>
		    }
		  </div>
		</Confirmation>
	    );
	} else {
	    return (
		<Confirmation
		  autoconfirm={VARIANTS[variant].autoconfirm}
		  onClick={() => this.handleCreate()}
		  message={VARIANTS[variant].messageCreate}
		  progress
		>
		  <div className={classes.buttonWrapper}>
		    <IconButton>
		      {VARIANTS[variant].falseIcon}
		    </IconButton>
		    {count !== undefined && 
		     <div className={classes.stat}>
		       ({liveCount})
		     </div>
		    }
		  </div>
		</Confirmation>
	    );
	}
    }
}

SimpleEdgeMutation.propTypes = {
    classes: PropTypes.object.isRequired,
    initial: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

export const FollowVal = 'follow';
export const LikeVal = 'like';
export const BookmarkVal = 'bookmark';
export const RsvpVal = 'rsvp';

export default withApollo(withStyles(styles)(SimpleEdgeMutation));
