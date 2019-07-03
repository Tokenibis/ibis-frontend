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
  		onClick={(e) => handlePage(<Nonprofit id={node.id} />)}
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
	let makeList, args

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		makeList = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data.allIbisUsers}
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
		    data={data.allIbisUsers}
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
		args = `(isNonprofit: true, orderBy: "-score", first: ${count})`;
		break;
	    case 'Popular':
		args = `(isNonprofit: true, orderBy: "-follower_count", first: ${count})`;
		break;
	    case 'New':
		args = `(isNonprofit: true, orderBy: "-date_joined", first: ${count})`;
		break;
	    case 'Following':
		args = `(isNonprofit: true, followedBy: "${context.userID}" orderBy: "first_name,last_name", first: ${count})`;
		break;
	    case '_Search':
		args = `(isNonprofit: true, search: "${filterValue.split(':')[1]}" orderBy: "first_name,last_name", first: ${count})`;
		break;
	    default:
		console.error('Unsupported filter option')
	}

	let query = gql`
	    query {
		allIbisUsers ${args} {
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
		}
	    }
	`;

	return <QueryHelper query={query} makeList={makeList} {...this.props} />;
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

