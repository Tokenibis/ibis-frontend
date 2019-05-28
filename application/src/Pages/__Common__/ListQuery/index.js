import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollToTop from "react-scroll-up";
import Fab from '@material-ui/core/Fab';
import UpIcon from '@material-ui/icons/ArrowUpward';

import ListView from '../ListView';

const styles = theme => ({
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
})

function ListQuery(props) {
    let { classes, query} = props
    return (
	<Query query={query}>
	  {({ loading, error, data }) => {
	      if (loading) return <CircularProgress className={classes.progress} />;
	      if (error) return `Error! ${error.message}`;
	      return <ListView data={(data[Object.keys(data)[0]])} {...props} />
	  }}
	</Query>
    );
};

ListQuery.propTypes = {
    classes: PropTypes.object.isRequired,
    scrollButton: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    makeImage: PropTypes.func.isRequired,
    makeLabel: PropTypes.func.isRequired,
    makeBody: PropTypes.func.isRequired,
    makeActions: PropTypes.func.isRequired,
};


export default withStyles(styles)(ListQuery);
