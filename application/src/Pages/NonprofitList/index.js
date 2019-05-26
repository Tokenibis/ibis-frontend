import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import ListView from '../__Common__/ListView';
import Nonprofit from '../Nonprofit';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
})

const QUERY = gql`
    query {
  	allNonprofits {
  	    edges {
  		node {
  		    title
  		    description
  		}
  	    }
  	}
    }
`;

class NonprofitList extends Component {

    makeImage = (node) => {
	let { classes, handleWindow } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handleWindow(<Nonprofit />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.description.length) % 10}.jpg`)}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	return (
  	    <Typography variant="body2">
  	      {node.title}
  	    </Typography>
	);
    }

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      {`${node.description.substring(0, 300)} ...`}
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
	      makeImage={this.makeImage}
	      makeLabel={this.makeLabel}
	      makeBody={this.makeBody}
	      makeActions={this.makeActions}
	    />
	)
    };
};

NonprofitList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(NonprofitList);
