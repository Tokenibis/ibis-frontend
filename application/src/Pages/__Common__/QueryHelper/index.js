import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    progress: {
	marginTop: theme.spacing(1),
    },
})

function QueryHelper(props) {
    let { classes, query, make} = props;
    return (
	<Query query={query}>
	  {({ loading, error, data }) => {
	      if (loading) return <LinearProgress className={classes.progress} />;
	      if (error) return `Error! ${error.message}`;
	      return make(data)
	  }}
	</Query>
    );
};

QueryHelper.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    make: PropTypes.func.isRequired,
};


export default withStyles(styles)(QueryHelper);
