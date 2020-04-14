/*

   The QueryHelper class is a light wrapper for the standard Query
   process. It mainly servers to factor out a little bit of code and
   provides a standardized look for the loading screen. QueryHelper
   requires the following two main inputs:

   - query: a graphql query (formatted in gql) make:
   - make: a render prop function which takes the returned data and
     renders React Component

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfiniteScroll from 'react-infinite-scroller';

const styles = theme => ({
    progress: {
	margin: theme.spacing(-0.5),
    },
    infiniteScroll:  {
	height: '80px',
    },
    loader: {
	marginTop: theme.spacing(2),
	margin: '0 auto',
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	textAlign: 'center',
    },
    empty: {
	margin: '0 auto',
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	textAlign: 'center',
    },

})

class QueryHelper extends Component {

    constructor({ variables }) {
	super();
	this.state = {
	    variables,
	    dataOld: [],
	}
    }

    componentWillReceiveProps({ variables }) {
	this.setState({
	    variables,
	    dataOld: [],
	});
    }
    
    paginate(dataCurrent) {
	let { variables } = this.state;
	variables.after = dataCurrent[dataCurrent.length - 1].cursor;

	this.setState({
	    variables,
	    dataOld: dataCurrent
	});
    }

    render() {
	let { variables, classes, query, make, infiniteScroll } = this.props;
	let { dataOld } = this.state;

	if (infiniteScroll) {
	    return (
		<div>
		  {dataOld && make(dataOld)}
		  <Query
		      fetchPolicy="no-cache"
		      query={query}
		      variables={variables}
		      partialRefetch={true}
		  >
		    {({ loading, error, data }) => {
			if (loading) return <LinearProgress className={classes.progress} />;
			if (error) return `Error! ${error.message}`;

			let dataCurrent = dataOld.concat(data[Object.keys(data)[0]].edges)

			return (
			    <div>
			      <InfiniteScroll
				  pageStart={0}
				  className={classes.infiniteScroll}
				  loadMore={() => this.paginate(dataCurrent)}
				  hasMore={(dataCurrent.length > dataOld.length) || data[Object.keys(data)[0]].pageInfo.hasNextPage}
				  loader={
				      <Typography
					  key={dataCurrent.length}
					  type="body2" className={classes.loader}
					  >
					Loading more results...
				      </Typography>
				  }
			      >
				<div key={0}></div>
			      </InfiniteScroll>
			      {
				  (dataCurrent.length === 0) &&
				  <Typography type="body2" className={classes.empty}>
				    Nothing to see here
				  </Typography>
			      }
			    </div>
			)
		    }}
		  </Query>
		</div>
	    );
	} else {
	    return (
		<Query fetchPolicy="no-cache" query={query} variables={variables}>
		  {({ loading, error, data }) => {
		      if (loading) return (
			  <LinearProgress  className={classes.progress} />
		      )
		      if (error) return `Error! ${error.message}`;
		      if (data[Object.keys(data)[0]].edges.length > 0) {
			  return make(data[Object.keys(data)[0]].edges)
		      } else {
			  return (
			      <Typography type="body2" className={classes.empty}>
				Nothing to see here
			      </Typography>
			  );
		      }
		  }}
		</Query>
	    );
	}
    }
};

QueryHelper.propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    make: PropTypes.func.isRequired,
};


export default withStyles(styles)(QueryHelper);