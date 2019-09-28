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
import CommentIcon from '@material-ui/icons/CommentOutlined';

import Link from '../../__Common__/CustomLink';
import CustomDivider from '../../__Common__/CustomDivider';
import NonprofitCategoryIcon from '../__Common__/NonprofitCategoryIcon';
import SimpleEdgeMutation, { LikeVal, RsvpVal } from '../__Common__/SimpleEdgeMutation';

import L from 'leaflet';
import './leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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
    query Event($id: ID! $self: String){
	event(id: $id){
	    id
	    title
	    image
	    created
	    description
	    date
	    address
	    latitude
	    longitude
	    user {
		id
		avatar
		nonprofit {
		    id
		    title
		    category {
			id
		    }
		}
	    }
	    hasLiked: like(id: $self) {
		edges {
		    node {
			id
		    }
		}
	    }
	    hasRsvp: rsvp(id: $self) {
		edges {
		    node {
			id
		    }
		}
	    }
	}
    }
`;

class Event extends Component {

    constructor ({ context }) {
	super();
	this.state = {
	    width: Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRation),
	    height: Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRatio),
	};
    }

    resizeMap = () => {
	let { context } = this.props;
	this.setState({
	    width: Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRation),
	    height: Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRatio),
	});
    };
    
    createPage(node) {
	let { width, height } = this.state;
	let { classes, context } = this.props;

	let imageHeight = Math.round(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

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
		      to={`Nonprofit?id=${node.user.nonprofit.id}`}
  		      alt="Ibis"
    		      src={node.user.avatar}
    		      className={classes.avatar}
		      />
		    </ListItemIcon>
		    <ListItemText
			primary={
			    <div>
  			      <Typography variant="body2" className={classes.name}>
  				{node.title}
  			      </Typography>
  			      <Typography variant="body2" className={classes.username}>
  				{new Date(node.created).toDateString()}
  			      </Typography>
			    </div>
			}
		    />
		  </ListItem>
  		  <CardMedia
		      style={{ height: imageHeight }}
    		      image={node.image}
  		      title={node.title}
  		  />
  		  <Typography variant="body2" className={classes.body}>
		    {node.description}
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
  		    {new Date(node.created).toGMTString()}
		  </Typography>
		</Grid>
		<Grid alignItems="right" className={classes.infoLeft} item xs={4}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'Where:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={8}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {node.address.split('\n').map((item, key) => (
			<span key={key}>{item}<br/></span>
		    ))}
		  </Typography>
		</Grid>
		<Grid className={classes.content} item xs={12}>
		  <Map
		      className={classes.map}
		      style={{ height: `${height}px`, width: `${width}px` }}
		      center={[node.latitude, node.longitude]}
		      zoom={13}
		      keyboard={false}
		  >
		    <TileLayer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		    />
		    <Marker position={[node.latitude, node.longitude]}>
		      <Popup>
			{node.address.split('\n').map((item, key) => (
			    <span key={key}>{item}<br/></span>
			))}
		      </Popup>
		    </Marker>
		  </Map>
		  <CustomDivider/>
		  <div className={classes.action}>
		    <div>
		      <SimpleEdgeMutation
			  variant={LikeVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasLiked.edges.length === 1}
		      />
		      <SimpleEdgeMutation
			  variant={RsvpVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasRsvp.edges.length === 1}
		      />
		    </div>
		    <NonprofitCategoryIcon
			id={node.user.nonprofit.category.id}
			className={classes.categoryIcon}
		    />
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
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="network-only"
		query={QUERY}
		variables={{ id, self: context.userID }}
	    >
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
