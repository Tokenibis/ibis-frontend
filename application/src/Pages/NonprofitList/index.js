import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Nonprofit from '../Nonprofit';
import Filter from '../__Common__/Filter';

import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

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
    }
});

const DEFAULT_COUNT = 25;

const QUERY_INNER = `
    edges {
  	node {
	    id
            username
            nonprofit {
                id
		title
  		description
	    }
  	}
    }
`;

class NonprofitList extends Component {

    constructor() {
	super();
	this.icons = [
	    <AnimalIcon />,
	    <ArtIcon />,
	    <CivilIcon />,
	    <DevelopmentIcon />,
	    <EducationIcon />,
	    <EnvironmentIcon />,
	    <HealthIcon />,
	    <HumanIcon />,
	]
    };

    makeImage = (node) => {
	let { classes, handlePage } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handlePage(<Nonprofit id={node.nonprofit.id} />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.nonprofit.description.length) % 10}.jpg`)}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.name}>
  		{node.nonprofit.title}
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
  	      {`${node.nonprofit.description.substring(0, 300)} ...`}
  	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <IconButton
		  className={classes.categoryIcon}
	      >
		{this.icons[(node.nonprofit.description.length) % this.icons.length]}
	      </IconButton>
	      <Button onClick={(e) => handlePage(<Nonprofit id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  More info
		</Typography>
	      </Button>
	    </div>
	);
    };

    render() {
	let { context, variant, filterValue, count } = this.props;
	let makeList, queryCustom, parser;

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		makeList = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data}
		    {...this.props}
		    />
		)
		break;

	    default:
		// show everything; intended for full-page lists
		makeList = (data) => (
		    <ListView
		    scrollButton
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data}
		    {...this.props}
		    />
		)
	};

	// set default values if needed
	filterValue = filterValue ? filterValue : 'Featured'
	count = count ? count: DEFAULT_COUNT

	// start with QUERY_INNER and wrap the custom ("modified") portion of the query
	switch (filterValue.split(':')[0]) {

	    case 'Featured':
		// Order all by descending Ibis internal featured "score"
		queryCustom = `
		    allIbisUsers(isNonprofit: true, orderBy: "-score", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allIbisUsers)
		break;

	    case 'Popular':
		// Order all by descending number of followers
		queryCustom = `
		    allIbisUsers(isNonprofit: true, orderBy: "-follower_count", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allIbisUsers)
		break;

	    case 'New':
		// Order all by date joined
		queryCustom = `
		    allIbisUsers(isNonprofit: true, orderBy: "-date_joined", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allIbisUsers)
		break;

	    case 'Following':
		// Show only ones being followed by the given user_id, ordered alphabetically
		queryCustom = `
		    ibisUser(id: "${context.userID}") {
			following(isNonprofit: true, orderBy: "first_name,last_name", first: ${count}) {
			    ${QUERY_INNER}
			}
		    }
		`;
		parser = (data) => (data.ibisUser.following)
		break;

	    default:
		console.error('Unsupported filter option')
	}

	// wrap the custom query in the "query{}" object to create final valid graphql query
	let query = gql`
	    query {
		${queryCustom}
	    }
	`;

	return <QueryHelper query={query} parser={parser} makeList={makeList} {...this.props} />;
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
