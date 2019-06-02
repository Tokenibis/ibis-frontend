import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import RSVPIcon from '@material-ui/icons/Event';
import CardMedia from '@material-ui/core/CardMedia';

import ListView from '../__Common__/ListView';
import Event from '../Event';
import Nonprofit from '../Nonprofit';

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
	paddingRight: theme.spacing.unit * 2,
	paddingLeft: theme.spacing.unit,
    },
    categoryIcon: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
})

class EventSublist extends Component {

    constructor({ handleWindow }) {
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
	let { classes, handleWindow } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handleWindow(<Nonprofit id={node.user.nonprofit.id} />)}
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
	let { classes, handleWindow } = this.props;
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
	      <Button onClick={(e) => handleWindow(<Event id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  Read more
		</Typography>
	      </Button>
	    </div>
	);
    };

    render() {
	let { data, scrollButton } = this.props;
	return (
	    <ListView
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeMedia={this.makeMedia}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		scrollButton={scrollButton}
		expandedAll={true}
		data={data}
	    />
	)
    };
};

EventSublist.propTypes = {
    classes: PropTypes.object.isRequired,
    handleWindow: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventSublist);
