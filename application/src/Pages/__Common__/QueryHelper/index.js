/*

   The QueryHelper class is a light wrapper for the standard Query
   process. It mainly servers to factor out a little bit of code and
   provides a standardized look for the loading screen. QueryHelper
   requires the following two main inputs:

   - query: a graphql query (formatted in gql) make:
   - make: a render prop function which takes the returned data and
     renders React Component

*/

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

function QueryHelper({ classes, query, make, variables }) {
    return (
	<Query query={query} variables={variables}>
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
