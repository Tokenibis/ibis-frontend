import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import ListView from '../__Common__/ListView';
import Person from '../Person';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing.unit * 2,
	paddingLeft: theme.spacing.unit,
    },
    body: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing.unit * 6,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
})

const QUERY = gql`
    query {
  	allIbisUsers {
  	    edges {
  		node {
  		    id
       		    firstName
  		    lastName
		    username
		    balance
		    followerCount
		    followingCount
		    user {
			dateJoined
		    }
  		    nonprofit {
  			id
  		    }
  		}
  	    }
  	} 
    }    
`;

class PersonList extends Component {

    filter = (node) => {
	return node.nonprofit === null;
    }

    makeImage = (node) => {
	let { classes, handleWindow } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handleWindow(<Person />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.firstName.length) % 10}.jpg`)}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.name}>
  		{`${node.firstName} ${node.lastName}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.username}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.body}>
		{`Date joined: ${new Date(node.user.dateJoined).toLocaleDateString()}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Number of followers: ${node.followerCount}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Number following: ${node.followingCount}`}
  	      </Typography>
  	      <Typography variant="body2" className={classes.body}>
		{`Current Balance: $${node.balance}`}
  	      </Typography>
	    </div>
	);
    }

    makeActions = (node) => {
	let { classes, handleWindow } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <Button onClick={(e) => handleWindow(<Person />)}>
		<Typography variant="body2" className={classes.info}>
		  Profile
		</Typography>
	      </Button>
	    </div>
	);
    };

    render() {
	let { data, scrollButton } = this.props;
	return (
	    <ListView
		filter={this.filter}
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		scrollButton={scrollButton}
		data={data}
	    />
	)
    };
};

PersonList.propTypes = {
    classes: PropTypes.object.isRequired,
    handleWindow: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(PersonList);
