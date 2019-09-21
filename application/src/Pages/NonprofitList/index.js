import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Filter from '../__Common__/Filter';
import NonprofitCategoryIcon from '../__Common__/NonprofitCategoryIcon';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
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

const QUERY = gql`
    query NonprofitList($search: String, $followedBy: String, $orderBy: String, $first: Int) {
	allNonprofits(search: $search, followedBy: $followedBy, orderBy: $orderBy, first: $first) {
	    edges {
  		node {
		    id
		    username
		    id
		    title
		    avatar
  		    description
		    category {
			id
		    }
  		}
	    }
	}
    }
`;

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
  	      <Typography variant="body2" className={classes.name}>
  		{node.title}
  	      </Typography>
  	      <Typography variant="body2" className={classes.username}>
  		{`@${node.username}`}
  	      </Typography>
	    </div>
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
	let { classes } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <IconButton>
		<NonprofitCategoryIcon
		    id={node.category.id}
		    className={classes.categoryIcon}
		/>
	      </IconButton>
	      <Typography
		  component={Link}
		  prefix={1}
		  to={`Nonprofit?id=${node.id}`}
		  variant="body2"
		  className={classes.info}
	      >
		More info
	      </Typography>
	    </div>
	);
    };

    render() {
	let { context, variant, filterValue, count } = this.props;
	let make, variables

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		make = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data.allNonprofits}
		    {...this.props}
		    />
		)
		break;

	    default:
		// show everything; intended for full-page lists
		make = (data) => (
		    <ListView
		    scrollButton
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data.allNonprofits}
		    {...this.props}
		    />
		)
	};

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

	return <QueryHelper query={QUERY} variables={variables} make={make} {...this.props} />;
    };
};

NonprofitList.propTypes = {
    classes: PropTypes.object.isRequired,
    filterValue: PropTypes.string.isRequired,
};

function NonprofitFilter(props) {
    return <Filter options={['Featured', 'Popular', 'New', 'Following']} {...props} />;
}

export { NonprofitFilter };
export default withStyles(styles)(NonprofitList);

