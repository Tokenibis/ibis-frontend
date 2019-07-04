import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import RSVPIcon from '@material-ui/icons/Event';
import CardMedia from '@material-ui/core/CardMedia';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Event from '../Event';
import Nonprofit from '../Nonprofit';
import EventFilter from './filter';

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
    media: {
	height: 160,
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
    }
});

const DEFAULT_COUNT = 25;

class EventList extends Component {

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
    	    <Avatar
  		onClick={(e) => handlePage(<Nonprofit id={node.user.id} />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.description.length) % 10}.jpg`)}
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
  		{new Date(node.date).toDateString()}
  	      </Typography>
	    </div>
	);
    };

    makeMedia = (node) => {
	let { classes } = this.props;
	return (
  	    <CardMedia
  		className={classes.media}
    		image={require(`../../Static/Images/egypt/pic${node.description.length % 10}.jpg`)}
  		title={node.title}
  	    />
	);
    };

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      {node.description}
  	    </Typography>
	);
    };

    makeActions = (node) => {
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <div>
  		<IconButton color="secondary" aria-label="Like">
  		  <LikeIcon />
  		</IconButton>
  		<IconButton color="secondary" aria-label="RSVP">
  		  <RSVPIcon />
  		</IconButton>
	      </div>
  	      <Typography variant="body2" className={classes.categoryIcon}>
		{this.icons[(node.description.length) % this.icons.length]}
	      </Typography>
	      <Button onClick={(e) => handlePage(<Event id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  Read more
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
			data={data.allEvents}
		    {...this.props}
		    />
		)
		break;

	    default:
		// show everything; intended for full-page lists
		makeList = (data) => (
		    <ListView
		    scrollButton
		    expandedAll
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeMedia={this.makeMedia}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data.allEvents}
		    {...this.props}
		    />
		)
	};

	// set default values if needed
	filterValue = filterValue ? filterValue : 'All'
	count = count ? count: DEFAULT_COUNT

	// the filterValue option determines the content of the data that gets fetched
	switch (filterValue.split(':')[0]) {
	    case 'All':
		args = `(orderBy: "-date", first: ${count})`;
		break;
	    case 'Featured':
		args = `(orderBy: "-score", first: ${count})`;
		break;
	    case 'Following':
		args = `(byFollowing: "${context.userID}", orderBy: "-date", first: ${count})`;
		break;
	    case 'Going':
		args = `(rsvpBy: "${context.userID}", orderBy: "-created", first: ${count})`;
		break;
	    case '_Search':
		args = `(search: "${filterValue.split(':')[1]}" orderBy: "-date", first: ${count})`;
		break;
	    case '_Host':
		args = `(byUser: "${filterValue.split(':')[1]}", orderBy: "-date", first: ${count})`;
		break;
	    case `_Going`:
		args = `(rsvpBy: "${filterValue.split(':')[1]}", orderBy: "-date", first: ${count})`;
		break;
	    case `_Calendar`:
		args = `(beginDate: "${filterValue.split(/:(.+)/)[1]}", orderBy: "-date", first: ${count})`;
		break;
	    default:
		console.error('Unsupported filter option')
	}

	let query = gql`
	    query {
		allEvents ${args} {
		    edges {
  			node {
  			    title
  			    description
  			    created
			    date
			    user {
				id
			    }
			}
		    }
		}
	    }
	`;

	return <QueryHelper query={query} makeList={makeList} {...this.props} />;
    };
};

EventList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export { EventFilter };
export default withStyles(styles)(EventList);
