import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import CardMedia from '@material-ui/core/CardMedia';

import Link from '../../__Common__/CustomLink';
import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
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
	color: theme.palette.secondary.main,
	textDecoration: 'None',
    }
});

const DEFAULT_COUNT = 25;

class NewsList extends Component {

    constructor({ count }) {
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
	let { classes } = this.props;
	return (
    	    <Avatar
		component={Link}
		prefix={1}
		to="News"
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
  		{new Date(node.created).toDateString()}
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
	let { classes } = this.props;
	return (
	    <div className={classes.action}>
	      <div>
  		<IconButton color="secondary" aria-label="Like">
  		  <LikeIcon />
  		</IconButton>
  		<IconButton color="secondary" aria-label="Bookmark">
  		  <BookmarkIcon />
  		</IconButton>
	      </div>
  	      <Typography variant="body2" className={classes.categoryIcon}>
		{this.icons[(node.description.length) % this.icons.length]}
	      </Typography>
	      <Link prefix={1} to="News">
		<Typography variant="body2" className={classes.info} >
		  Read more
		</Typography>
	      </Link>
	    </div>
	);
    };

    render() {
	let { context, variant, filterValue, count } = this.props;
	let make, args;

	// variant does not affect the content, only the visually displayed information
	switch (variant) {

	    case 'minimal':
		// hide icons/pictures and scroll button; intended for small partial-page lists
		make = (data) => (
		    <ListView
			makeLabel={this.makeLabel}
			makeBody={this.makeBody}
			makeActions={this.makeActions}
			data={data.allNews}
		    {...this.props}
		    />
		)
		break;

	    default:
		// show everything; intended for full-page lists
		make = (data) => (
		    <ListView
		    scrollButton
		    expandedAll
		    makeImage={this.makeImage}
		    makeLabel={this.makeLabel}
		    makeMedia={this.makeMedia}
		    makeBody={this.makeBody}
		    makeActions={this.makeActions}
		    data={data.allNews}
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
		args = `(orderBy: "-created", first: ${count})`;
		break;
	    case 'Featured':
		args = `(orderBy: "-score", first: ${count})`;
		break;
	    case 'Following':
		args = `(byFollowing: "${context.userID}", orderBy: "-created", first: ${count})`;
		break;
	    case 'Bookmarked':
		args = `(bookmarkBy: "${context.userID}", orderBy: "-created", first: ${count})`;
		break;
	    case 'Classic':
		args = `(orderBy: "-like_count", first: ${count})`;
		break;
	    case '_Search':
		args = `(search: "${filterValue.split(':')[1]}" orderBy: "-created", first: ${count})`;
		break;
	    case '_Author':
		args = `(byUser: "${filterValue.split(':')[1]}", orderBy: "-created", first: ${count})`;
		break;
	    default:
		console.error('Unsupported filter option')
		
	}

	let query = gql`
	    query {
		allNews ${args} {
		    edges {
  			node {
			    id
			    title
			    description
			    created
			    user {
				id
			    }
			}
		    }
		}
	    }
	`;

	return <QueryHelper query={query} make={make} {...this.props} />;
    };
};

NewsList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function NewsFilter(props) {
    return <Filter options={['All', 'Featured', 'Following', 'Bookmarked', 'Classic']} {...props} />;
}

export { NewsFilter };
export default withStyles(styles)(NewsList);
