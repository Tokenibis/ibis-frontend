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
import Poller from '../../__Common__/Poller';

const styles = theme => ({
    progress: {
	margin: theme.spacing(-0.5),
    },
    loader: {
	height: '80px',
	marginTop: theme.spacing(4),
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
	    position: 0,
	    oriented: false,
	    keepBottom: false,
	}
    }

    componentWillReceiveProps({ query, variables, refreshTrigger }) {
	if (refreshTrigger && refreshTrigger !== this.props.refreshTrigger) {
	    this.refresh();
	}
    }

    componentDidUpdate() {
	let { reverseScroll } = this.props;
	let { oriented, keepBottom } = this.state;
	if (reverseScroll) {
	    // scroll down when first load
	    if (!oriented) {
		window.scrollTo(0, document.body.scrollHeight);
		this.setState({ oriented: true });
	    }
	    if (keepBottom) {
		window.scrollTo(0, document.body.scrollHeight);
	    }
	}
    }

    refresh = (dataRefresh = [], force = true) => {
	let { client, query } = this.props;
	let { data } = this.state;
	let variables = JSON.parse(JSON.stringify(this.props.variables));

	let index = data.length > 0 ?
		    dataRefresh.map(item => item.node.id).indexOf(data[0].node.id) :
		    dataRefresh.length;

	if (index < 0 || force) {
	    if (dataRefresh.length) {
		variables.after = dataRefresh[dataRefresh.length - 1].cursor;
	    } else {
		delete variables.after;
	    }
	    variables.first = 1;

	    client.query({
		query,
		variables,
		fetchPolicy:"no-cache",
	    }).then(response => {
		let dataNew = response.data[Object.keys(response.data)[0]].edges;
		this.refresh(dataRefresh.concat(dataNew), false);
	    }).catch(error => {
		this.setState({ data: null });
	    })
	} else {
	    this.setState({
		keepBottom: (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2,
		data: dataRefresh.slice(0, index).concat(data)
	    });
	}
    }

    paginate = () => {
	let { client, variables, query } = this.props;
	let { data } = this.state;

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
	    this.setState({ data, hasMore });
	}).catch(error => {
	    this.setState({ data: null });
	})
    }

    render() {
	let {
	    variables,
	    classes,
	    query,
	    make,
	    scroll,
	    reverseScroll,
	    pollTime,
	    emptyMessage,
	} = this.props;
	let { data, hasMore } = this.state;

	if (data === null) {
	    return `Error loading results`;
	}

	if (scroll) {
	    return (
		<Poller action={this.refresh} pollTime={pollTime}>
		  <InfiniteScroll
		      pageStart={0}
		      hasMore={hasMore}
		      isReverse={reverseScroll}
		      loadMore={(!data.length || scroll === 'infinite') ? (
			  () => this.paginate()
		      ):(
			  () => {}
		      )}
		      loader={(scroll === 'infinite' || (!data.length && hasMore)) ? (
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
		    {data.length ? (
			make(data)
		    ):(
			hasMore ? (
			    <div></div>
			):(
			    <Typography type="body2" className={classes.empty}>
			      {emptyMessage ? emptyMessage : 'Nothing to see here'}
			    </Typography>
			)
		    )}
		  </InfiniteScroll>
		</Poller>
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
