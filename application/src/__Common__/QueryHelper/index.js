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
import { Query, withApollo } from "react-apollo";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfiniteScroll from 'react-infinite-scroller';

const styles = theme => ({
    progress: {
	margin: theme.spacing(-0.5),
    },
    loader: {
	height: '80px',
	marginTop: theme.spacing(2),
	margin: '0 auto',
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	textAlign: 'center',
    },
    empty: {
	paddingTop: theme.spacing(4),
	paddingBottom: theme.spacing(4),
	margin: '0 auto',
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	textAlign: 'center',
    },
    manualWrapper: {
	height: '80px',
	marginTop: theme.spacing(2),
	margin: '0 auto',
	textAlign: 'center',
    },
    manual: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
})

class QueryHelper extends Component {

    constructor({ variables }) {
	super();
	this.state = {
	    data: [],
	    hasMore: true,
	    page: 0,
	    position: 0,
	}
    }

    componentWillReceiveProps({ variables }) {
	this.setState({
	    variables,
	    data: [],
	});
    }

    componentDidUpdate() {
	let { page } = this.state;
	if (page <= 1) {
	    window.scrollTo(0,document.body.scrollHeight);
	}
    }

    paginate = () => {
	let { client, variables, query } = this.props;
	let { data, page } = this.state;

	if (data.length) {
	    variables.after = data[data.length - 1].cursor;
	}

	client.query({
	    query,
	    variables,
	    fetchPolicy:"no-cache",
	}).then(response => {
	    let dataNew = response.data[Object.keys(response.data)[0]].edges;
	    let hasMore = response.data[Object.keys(response.data)[0]].pageInfo.hasNextPage;
	    data = data.concat(dataNew);
	    this.setState({ data, hasMore, page: page + 1 });
	}).catch(error => {
	    this.setState({ data: null });
	})
    }

    render() {
	let { variables, classes, query, make, scroll, reverseScroll } = this.props;
	let { data, hasMore } = this.state;

	if (data === null) {
	    return `Error loading results`;
	}

	if (scroll) {
	    return (
		<div>
		  <InfiniteScroll
		      pageStart={0}
		      hasMore={hasMore}
		      isReverse={reverseScroll}
		      loadMore={(!data.length || scroll === 'infinite') ? (
			  () => this.paginate()
		      ):(
			  () => {}
		      )}
		      loader={scroll === 'infinite' ? (
			  <Typography key={data.length} type="body2" className={classes.loader}>
			    Loading more results...
			  </Typography>
		      ):(
			  <div className={classes.manualWrapper}>
			    <Button onClick={() => this.paginate()} >
			      <Typography variant="body2" className={classes.manual}>
				Click to Load More
			      </Typography>
			    </Button>
			  </div>
		      )}
		  >
		    {data ? (
			make(data)
		    ):(
			hasMore ? (
			    <LinearProgress className={classes.progress}/>
			):(
			    <Typography type="body2" className={classes.empty}>
			      Nothing to see here
			    </Typography>
			)
		    )}
		  </InfiniteScroll>
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


export default withApollo(withStyles(styles)(QueryHelper));
