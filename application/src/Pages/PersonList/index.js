import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import ListView from '../__Common__/ListView';
import Person from '../Person';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    label: {
	fontWeight: 'bold',
    },
})

const QUERY = gql`
    query {
  	allIbisUsers {
  	    edges {
  		node {
  		    id
       		    firstName
  		    lastName
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
  	    <Typography variant="body2" className={classes.label}>
  	      {`${node.firstName} ${node.lastName}`}
  	    </Typography>
	);
    }

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      I like to microwave butterflies
  	    </Typography>
	);
    }

    makeActions = (node) => {
	return;
    };

    render() {
	return (
	    <ListView
	      query={QUERY}
	      filter={this.filter}
	      makeImage={this.makeImage}
	      makeLabel={this.makeLabel}
	      makeBody={this.makeBody}
	      makeActions={this.makeActions}
	    />
	)
    };
};

PersonList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(PersonList);
