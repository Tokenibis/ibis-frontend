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

const styles = theme => ({})

const VARIANTS = {
    follow: {
	createMutation: loader('../../../Static/graphql/operations/FollowCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/FollowDelete.gql'),
	trueIcon: <FollowFilledIcon color="secondary" />,
	falseIcon: <FollowOutlinedIcon color="secondary" />,
    },
    like: {
	createMutation: loader('../../../Static/graphql/operations/LikeCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/LikeDelete.gql'),
	trueIcon: <LikeFilledIcon color="secondary" />,
	falseIcon: <LikeOutlinedIcon color="secondary" />,
    },
    bookmark: {
	createMutation: loader('../../../Static/graphql/operations/BookmarkCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/BookmarkDelete.gql'),
	trueIcon: <BookmarkFilledIcon color="secondary" />,
	falseIcon: <BookmarkOutlinedIcon color="secondary" />,
    },
    rsvp: {
	createMutation: loader('../../../Static/graphql/operations/RsvpCreate.gql'),
	deleteMutation: loader('../../../Static/graphql/operations/RsvpDelete.gql'),
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
