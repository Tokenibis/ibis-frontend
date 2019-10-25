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
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import IconButton from '@material-ui/core/IconButton';
import FollowOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import FollowFilledIcon from '@material-ui/icons/HowToReg';
import LikeOutlinedIcon from '@material-ui/icons/FavoriteBorder';
import LikeFilledIcon from '@material-ui/icons/Favorite';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkFilledIcon from '@material-ui/icons/Bookmark';
import RsvpOutlinedIcon from '@material-ui/icons/CalendarToday';
import RsvpFilledIcon from '@material-ui/icons/EventAvailable';

const styles = theme => ({})

const VARIANTS = {
    follow: {
	createMutation: gql`
	    mutation Follow($user: ID! $target: ID!) {
		createFollow(user: $user target: $target) {
		    state
		}
	    }
	`,
	deleteMutation: gql`
	    mutation Unfollow($user: ID! $target: ID!) {
		deleteFollow(user: $user target: $target) {
		    state
		}
	    }
	`,
	trueIcon: <FollowFilledIcon color="secondary" />,
	falseIcon: <FollowOutlinedIcon color="secondary" />,
    },
    like: {
	createMutation: gql`
	    mutation Like($user: ID! $target: ID!) {
		createLike(user: $user target: $target) {
		    state
		}
	    }
	`,
	deleteMutation: gql`
	    mutation Unlike($user: ID! $target: ID!) {
		deleteLike(user: $user target: $target) {
		    state
		}
	    }
	`,
	trueIcon: <LikeFilledIcon color="secondary" />,
	falseIcon: <LikeOutlinedIcon color="secondary" />,
    },
    bookmark: {
	createMutation: gql`
	    mutation Bookmark($user: ID! $target: ID!) {
		createBookmark(user: $user target: $target) {
		    state
		}
	    }
	`,
	deleteMutation: gql`
	    mutation Unbookmark($user: ID! $target: ID!) {
		deleteBookmark(user: $user target: $target) {
		    state
		}
	    }
	`,
	trueIcon: <BookmarkFilledIcon color="secondary" />,
	falseIcon: <BookmarkOutlinedIcon color="secondary" />,
    },
    rsvp: {
	createMutation: gql`
	    mutation Rsvp ($user: ID! $target: ID!) {
		createRsvp(user: $user target: $target) {
		    state
		}
	    }
	`,
	deleteMutation: gql`
	    mutation Unrsvp ($user: ID! $target: ID!) {
		deleteRsvp(user: $user target: $target) {
		    state
		}
	    }
	`,
	trueIcon: <RsvpFilledIcon color="secondary" />,
	falseIcon: <RsvpOutlinedIcon color="secondary" />,
    },
};


class SimpleEdgeMutation extends Component {
    
    constructor({ initial }) {
	super();
	this.state = { initial };
    }

    updateInitial(mutation, user) {
	mutation().then(response => {
	    this.setState({ initial: response.data[Object.keys(response.data)[0]].state });
	})
    }

    render() {
	let { variant, user, target } = this.props
	let { initial } = this.state

	if (initial) {
	    return (
		<Mutation mutation={VARIANTS[variant].deleteMutation} variables={{ user, target }}>
		  {mutation => (
		      <IconButton onClick={() => this.updateInitial(mutation, user)}>
			{VARIANTS[variant].trueIcon}
		      </IconButton>
		  )}
		</Mutation>
	    )
	} else {
	    return (
		<Mutation mutation={VARIANTS[variant].createMutation} variables={{ user, target }}>
		  {mutation => (
		      <IconButton onClick={() => this.updateInitial(mutation, user)}>
			{VARIANTS[variant].falseIcon}
		      </IconButton>
		  )}
		</Mutation>
	    )
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

export default withStyles(styles)(SimpleEdgeMutation);
