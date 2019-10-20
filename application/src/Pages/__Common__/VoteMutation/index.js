/*
   
   Helper component for rendering interactive Vote Mutation Icons.
   Vote Mutations are similar to Simple Edge Mutations except that it
   needs to atomically handle upvoting and downvoting. The React
   component provides hard-coded toggleable icons for downvoting and
   upvoting and graphql mutation functionality to interactively update
   the value to the remote server.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import UpvoteOutlinedIcon from '@material-ui/icons/ForwardOutlined';
import UpvoteFilledIcon from '@material-ui/icons/Forward';
import DownvoteOutlinedIcon from '@material-ui/icons/ForwardOutlined';
import DownvoteFilledIcon from '@material-ui/icons/Forward';

const NeutralVal = 0;
const UpvoteVal = 1;
const DownvoteVal = 2;

const styles = theme => ({
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    upvote: {
	transform: 'rotate(-90deg)',
    },
    downvote: {
	transform: 'rotate(90deg)',
    },
    diff: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
})

const createMutation = gql`
    mutation Vote($user: ID! $target: ID! $isUpvote: Boolean!) {
	createVote(user: $user target: $target isUpvote: $isUpvote) {
	    vote {
		id
	    }
	}
    }
`;

const deleteMutation = gql`
    mutation Unvote($user: ID! $target: ID!) {
	deleteVote(user: $user target: $target) {
	    status
	}
    }
`;


class VoteMutation extends Component {
    
    constructor({ initial, diff }) {
	super();
	this.state = { initial, diff };
    }

    updateInitial(mutation, user, initial, diff) {
	mutation().then(response => {
	    this.setState({ initial, diff })
	})
    }

    render() {
	let { user, target, classes } = this.props
	let { initial, diff } = this.state
	
	if (initial === UpvoteVal) {
	    return (
		<div className={classes.action}>
		  <Mutation mutation={deleteMutation} variables={{ user, target }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, NeutralVal, diff-1)}>
			  <UpvoteFilledIcon className={classes.upvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		  <Typography variant="body2" className={classes.diff}>
		    {diff > 0 && '+'} {diff < 0 && '-'} {Math.abs(diff)}
		  </Typography>
		  <Mutation mutation={createMutation} variables={{ user, target, isUpvote: false }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, DownvoteVal, diff-2)}>
			  <DownvoteOutlinedIcon className={classes.downvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		</div>
	    )
	} else if (initial === DownvoteVal) {
	    return (
		<div className={classes.action}>
		  <Mutation mutation={createMutation} variables={{ user, target, isUpvote: true }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, UpvoteVal, diff+2)}>
			  <UpvoteOutlinedIcon className={classes.upvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		  <Typography variant="body2" className={classes.diff}>
		    {diff > 0 && '+'} {diff < 0 && '-'} {Math.abs(diff)}
		  </Typography>
		  <Mutation mutation={deleteMutation} variables={{ user, target }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, NeutralVal, diff+1)}>
			  <DownvoteFilledIcon className={classes.downvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		</div>
	    )
	} else {
	    return (
		<div className={classes.action}>
		  <Mutation mutation={createMutation} variables={{ user, target, isUpvote: true }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, UpvoteVal, diff+1)}>
			  <UpvoteOutlinedIcon className={classes.upvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		  <Typography variant="body2" className={classes.diff}>
		    {diff > 0 && '+'} {diff < 0 && '-'} {Math.abs(diff)}
		  </Typography>
		  <Mutation mutation={createMutation} variables={{ user, target, isUpvote: false }}>
		    {mutation => (
			<IconButton
			    onClick={() => this.updateInitial(mutation, user, DownvoteVal, diff-1)}>
			  <DownvoteOutlinedIcon className={classes.downvote} color="secondary" />
			</IconButton>
		    )}
		  </Mutation>
		</div>
	    )
	}
    }
}
    
VoteMutation.propTypes = {
    classes: PropTypes.object.isRequired,
    diff: PropTypes.number.isRequired,
    initial: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
};

export {
    NeutralVal,
    UpvoteVal,
    DownvoteVal,
}

export default withStyles(styles)(VoteMutation);