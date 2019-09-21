import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardMedia from '@material-ui/core/CardMedia';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import Link from '../../__Common__/CustomLink';
import CustomDivider from '../../__Common__/CustomDivider';

import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

import './leaflet.css';

const styles = theme => ({
    root: {
	marginRight: 'auto',
	marginLeft: 'auto',
	width: '90%',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    categoryIcon: {
	color: theme.palette.tertiary.main,
	fontSize: 20,
	marginBottom: -4,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    info: {
	paddingTop: theme.spacing(2),
    },
    infoLeft: {
	marginLeft: 'auto',
    },
    infoRight: {
	marginRight: 'auto',
    },
    infoLine: {
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    media: {
	height: 160,
	paddingBottom: theme.spacing(1),
    },
    image: {
	marginLeft: '0px',
	paddingLeft: '0px',
    },
    body: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
	paddingTop: theme.spacing(2),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
    },
    stats: {
	color: theme.palette.secondary.main,
	fontSize: 14,
    },
    statIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.secondary.main,
    },
    map: {
	marginBottom: theme.spacing(1),
    },
    divider: {
	width: '100%',
    },
    bottom: {
	height: theme.spacing(5),
    },
});

const QUERY = gql`
    query Event($id: ID!){
	event(id: $id){
	    id
	    title
	    created
	    description
	    user {
		id
		nonprofit {
		    id
		    title
		}
	    }
	}
    }
`;

const wRatio = 0.9;
const hRatio = (9/16) * 0.9;
const position = [35.106766, -106.629181]

class Event extends Component {

    state = {
	width: Math.round(window.innerWidth * wRatio),
	height: Math.round(window.innerWidth * hRatio),
    };

    constructor({ classes }) {
	super();
	this.icons = [
	    <AnimalIcon className={classes.categoryIcon} />,
	    <ArtIcon className={classes.categoryIcon} />,
	    <CivilIcon className={classes.categoryIcon} />,
	    <DevelopmentIcon className={classes.categoryIcon} />,
	    <EducationIcon className={classes.categoryIcon} />,
	    <EnvironmentIcon className={classes.categoryIcon} />,
	    <HealthIcon className={classes.categoryIcon} />,
	    <HumanIcon className={classes.categoryIcon} />,
	]
    };

    resizeMap = () => {
	this.setState({
	    width: Math.round(window.innerWidth * wRatio),
	    height: Math.round(window.innerWidth * hRatio)
	});
    };
    
    createPage(event) {
	let { width, height } = this.state;
	let { classes } = this.props;

	window.addEventListener('resize', this.resizeMap);

	return (
	    <div className={classes.root}>
  	      <Grid container justify="center" alignItems="center" >
		<Grid item xs={12}>
		  <ListItem
		      className={classes.image}
		  >
		    <ListItemIcon>
    		      <Avatar
		      component={Link}
		      prefix={1}
		      to={`Nonprofit?id=${event.user.nonprofit.id}`}
  		      alt="Ibis"
    		      src={require(`../../Static/Images/birds/bird${(event.description.length) % 10}.jpg`)}
    		      className={classes.avatar}
		      />
		    </ListItemIcon>
		    <ListItemText
			primary={
			    <div>
  			      <Typography variant="body2" className={classes.name}>
  				{event.title}
  			      </Typography>
  			      <Typography variant="body2" className={classes.username}>
  				{new Date(event.created).toDateString()}
  			      </Typography>
			    </div>
			}
		    />
		  </ListItem>
  		  <CardMedia
  		      className={classes.media}
    		      image={require(`../../Static/Images/egypt/pic${event.description.length % 10}.jpg`)}
  		      title={event.title}
  		  />
  		  <Typography variant="body2" className={classes.body}>
		    {event.description}
		  </Typography>
		  <CustomDivider/>
		</Grid>
		<Grid alignItems="right" className={classes.infoLeft} item xs={4}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'Who:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={8}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'8:00 AM - 12:00 PM'}
		  </Typography>
		</Grid>
		<Grid alignItems="right" className={classes.infoLeft} item xs={4}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'Where:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={8}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'55555 Road Rd.'}
		  </Typography>
		</Grid>
		<Grid alignItems="right" className={classes.infoLeft} item xs={4}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {''}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={8}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'Albuquerque NM 88888'}
		  </Typography>
		</Grid>
		<Grid className={classes.content} item xs={12}>
		  <Map
		      className={classes.map}
		      style={{ height: `${height}px`, width: `${width}px` }}
		      center={position}
		      zoom={13}
		      keyboard={false}
		  >
		    <TileLayer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		    />
		    <Marker position={position}>
		      <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
		    </Marker>
		  </Map>
		  <CustomDivider/>
		  <div className={classes.action}>
		    <div>
		      <IconButton className={classes.stats}>
			<LikeIcon className={classes.statIcon}/> (0)
		      </IconButton>
  		      <IconButton>
  			<BookmarkIcon className={classes.statIcon}/>
  		      </IconButton>
		    </div>
		    {this.icons[(event.description.length) % this.icons.length]}
		    <IconButton className={classes.stats}>
		      <CommentIcon className={classes.statIcon}/> (0)
		    </IconButton>
		  </div>
		  <CustomDivider/>
		</Grid>
		<Grid item xs={12}><div className={classes.bottom} /></Grid>
	      </Grid>
	    </div>
	);
    }

    render() {
	let { classes, id } = this.props

	return (
	    <Query query={QUERY} variables={{ id }}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.event);
	      }}
	    </Query>
	);
    };
};


export default withStyles(styles)(Event);
