import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Followicon from '@material-ui/icons/Add';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Person from '../Person';
import Filter from '../__Common__/Filter';

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
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing.unit * 3,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
})

const DEFAULT_COUNT = 25;

class PersonList extends Component {

    constructor({ handlePage, count }) {
	super();

	this.query = gql`
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
    };
    
    filter = (node) => {
	return node.nonprofit === null;
    }

    makeImage = (node) => {
	let { classes, handlePage } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handlePage(<Person id={node.id} />)}
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
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<Followicon />
	      </IconButton>
	      <Button onClick={(e) => handlePage(<Person id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  Profile
		</Typography>
	      </Button>
	    </div>
	);
    };

    makeListDefault = (data) => {
	return (
	    <ListView
		scrollButton
		filter={this.filter}
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    makeListMinimal = (data) => {
	return (
	    <ListView
		filter={this.filter}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    render() {
	let { variant } = this.props;
	let makeList;

	switch (variant) {
	    case 'minimal':
		makeList = this.makeListMinimal;
		break;
	    default:
		makeList = this.makeListDefault;
	};

	return <QueryHelper query={this.query} makeList={makeList} {...this.props} />;
    };
};

PersonList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function PersonFilter(props) {
    return <Filter options={['All', 'Following', 'Followers']} {...props} />;
}

export { PersonFilter };
export default withStyles(styles)(PersonList);
