import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
})

function QueryHelper(props) {
    let { classes, query, makeList} = props;
    return (
	<Query query={query}>
	  {({ loading, error, data }) => {
	      if (loading) return <CircularProgress className={classes.progress} />;
	      if (error) return `Error! ${error.message}`;
	      return makeList(data)
	  }}
	</Query>
    );
};

QueryHelper.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    makeList: PropTypes.func.isRequired,
};


export default withStyles(styles)(QueryHelper);
