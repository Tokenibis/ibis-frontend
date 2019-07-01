import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Donation from '../Donation';
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
    categoryIcon: {
	color: theme.palette.secondary.main,
	padding: 0,
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    label: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
});

const DEFAULT_COUNT = 25;

const QUERY_INNER = `
    edges {
	node {
	    id
	    amount
	    description
	    created
	    target {
		firstName
		lastName
		nonprofit {
		    id
		    title
		}
	    }
	    user {
		firstName
		lastName
	    }
	}
    }
`;


class DonationList extends Component {

    constructor({ handlePage, count }) {
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
	    <IconButton
	      className={classes.categoryIcon}
	      onClick={(e) => handlePage(<Donation />)}
	    >
	      {this.icons[(node.description.length) % this.icons.length]}
	    </IconButton>
	);
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <Typography variant="body2" className={classes.label}>
	      {`${node.user.firstName} ${node.user.lastName}`}
	      {<ToIcon className={classes.toIcon} />}
	      {node.target.nonprofit.title}
	    </Typography>
	);
    }

    makeBody = (node) => {
	return (
	    <Typography variant="body2">
	      {node.description}
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
	      <Typography variant="body2" className={classes.amount}>
		{`$${node.amount}`}
	      </Typography>
	      <Button onClick={(e) => handlePage(<Donation />)}>
		<Typography variant="body2" className={classes.details}>
		  Details
		</Typography>
	      </Button>
	    </div>
	);
    };

    render() {
	let { variant, filterValue, count } = this.props;
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
	filterValue = filterValue ? filterValue : 'Me'
	count = count ? count: DEFAULT_COUNT

	// start with QUERY_INNER and wrap the custom ("modified") portion of the query
	switch (filterValue.split(':')[0]) {

	    case 'Me':
		// Order all by descending Ibis internal featured "score"
		queryCustom = `
		    ibisUser(id: "SWJpc1VzZXJOb2RlOjc2") {
			transferSet(isDonation: true, orderBy: "-created", first: ${count}) {
			    ${QUERY_INNER}
			}
		    }
		`;
		parser = (data) => (data.ibisUser.transferSet)
		break;

	    case 'Following':
		// Order all by descending number of followers
		queryCustom = `
                    allTransfers(isDonation: true, byFollowing: "SWJpc1VzZXJOb2RlOjc1", orderBy: "-created", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allTransfers)
		break;

	    case 'Public':
		// Order all by date joined
		queryCustom = `
                    allTransfers(isDonation: true, orderBy: "-created", first: ${count}) {
			${QUERY_INNER}
		    }
		`;
		parser = (data) => (data.allTransfers)
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

DonationList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function DonationFilter(props) {
    return <Filter options={['Me', 'Following', 'Public']} {...props} />;
}

export { DonationFilter };
export default withStyles(styles)(DonationList);
