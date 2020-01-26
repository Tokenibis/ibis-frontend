import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import SimpleEdgeMutation, { FollowVal } from '../__Common__/SimpleEdgeMutation';
import Truncated from '../__Common__/Truncated';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    categoryIcon: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	textDecoration: 'none',
    }
});

const query = loader('../../Static/graphql/operations/NonprofitList.gql')

const DEFAULT_COUNT = 25;

class NonprofitList extends Component {

    makeImage = (node) => {
	let { classes  } = this.props;
	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to={`Nonprofit?id=${node.id}`}
  		alt="Ibis"
    		src={node.avatar}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.title}>
  		{node.name}
  	      </Typography>
  	      <Typography variant="body2" className={classes.subtitle}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      <Truncated text={node.description}/>
  	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, context } = this.props;
	return (
	    <div className={classes.action}>
	      <SimpleEdgeMutation
		  variant={FollowVal}
		  user={context.userID}
		  target={node.id}
		  initial={node.isFollowing.edges.length === 1}
	      />
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Nonprofit?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		Go to page
	      </Typography>
	    </div>
	);
    };

    render() {
	let { context, minimal, filterValue, count } = this.props;
	let infiniteScroll, make, variables

	if (minimal) {
	    // hide icons/pictures and scroll button; intended for small partial-page lists
	    infiniteScroll = false;
	    make = (data) => (
		<ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		data={data}
		/>
	    )
	} else {
	    // show everything; intended for full-page lists
	    infiniteScroll = true;
	    make = (data) => (
		<ListView
		    infiniteScroll={this.infiniteScroll}
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data}
		/>
	    )
	}

	// set default values if needed
	filterValue = filterValue ? filterValue : 'Featured'
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Featured':
		variables = {
		    orderBy: "-score",
		    first: count,
		}
		break;
	    case 'Popular':
		variables = {
		    orderBy: "-follower_count",
		    first: count,
		}
		break;
	    case 'New':
		variables = {
		    orderBy: "-date_joined",
		    first: count,
		}
		break;
	    case 'Following':
		variables = {
		    followedBy: context.userID,
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Following':
		variables = {
		    followedBy: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    case '_Search':
		variables = {
		    search: filterValue.split(':')[1],
		    orderBy: "first_name,last_name",
		    first: count,
		}
		break;
	    default:
		console.error('Unsupported filter option')
	}

	variables.self = context.userID

	return (
	    <QueryHelper
		query={query}
		variables={variables}
		make={make}
		infiniteScroll={infiniteScroll}
	    />
	);
    };
};

NonprofitList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function NonprofitFilter(props) {
    return <Filter options={['Featured', 'Popular', 'Following']} {...props} />;
}

export { NonprofitFilter };
export default withStyles(styles)(NonprofitList);

