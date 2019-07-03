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
	let { context, variant, filterValue, count } = this.props;
	let makeList, args;

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		makeList = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data.allTransfers}
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
		    data={data.allTransfers}
		    {...this.props}
		    />
		)
	};

	// set default values if needed
	filterValue = filterValue ? filterValue : 'Me'
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'Me':
		args = `(isDonation: true, byUser: "${context.userID}", orderBy: "-created", first: ${count})`;
		break;
	    case 'Following':
		args = `(isDonation: true, byFollowing: "${context.userID}", orderBy: "-created", first: ${count})`;
		break;
	    case 'Public':
		args = `(isDonation: true, orderBy: "-created", first: ${count})`;
		break;
	    case '_Search':
		args = `(isDonation: true, search: "${filterValue.split(':')[1]}" orderBy: "-created", first: ${count})`;
		break;
	    case '_User':
		args = `(isDonation: true, byUser: "${filterValue.split(':')[1]}", orderBy: "-created", first: ${count})`;
		break;
	    default:
		console.error('Unsupported filter option')
	}

	let query = gql`
	    query {
		allTransfers ${args} {
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
		}
	    }
	`;

	return <QueryHelper query={query} makeList={makeList} {...this.props} />;
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
