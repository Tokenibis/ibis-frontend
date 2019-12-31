import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CardMedia from '@material-ui/core/CardMedia';
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import Confirmation from '../__Common__/Confirmation';
import CustomMarkdown from '../__Common__/CustomMarkdown';
import PersonDialogList, {
    LikeVal as DialogLikeVal,
    RsvpVal as DialogRsvpVal,
} from '../__Common__/PersonDialogList';
import SimpleEdgeMutation, { LikeVal, BookmarkVal, RsvpVal } from '../__Common__/SimpleEdgeMutation';
import CommentTree from '../__Common__/CommentTree';

const config = require('../../config.json');

const styles = theme => ({
    content: {
	width: '90%',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    progress: {
	margin: theme.spacing(-0.5),
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
    edgeMutations: {
	display: 'flex',
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
    personDialogWrapper: {
	marginTop: theme.spacing(1),
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
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
	fontWeight: 'bold',
    },
});

const query = loader('../../Static/graphql/operations/Event.gql')

class Event extends Component {

    constructor ({ context }) {
	super();
	// use Math.ceil + 0.89 because 0.9 seems to overflow a bit most of the time
	this.state = {
	    likeCount: null,
	    rsvpCount: null,
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth) * 0.89),
	    height: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRatio),
	};
    }

    resizeMap = () => {
	let { context } = this.props;
	this.setState({
	    width: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth) * 0.89),
	    height: Math.ceil(Math.min(window.innerWidth, context.maxWindowWidth)
		* context.displayRatio),
	});
    };
    
    createPage(node) {
	let { likeCount, rsvpCount, width, height } = this.state;
	let { classes, context, id } = this.props;

	let likeCallback = (change) => {
	    this.setState({ likeCount: node.likeCount + change });
	}
	let rsvpCallback = (change) => {
	    this.setState({ rsvpCount: node.rsvpCount + change });
	}
	if (likeCount === null || rsvpCount === null) {
	    this.setState({ likeCount: node.likeCount, rsvpCount: node.rsvpCount });
	}

	let imageHeight = Math.floor(Math.min(window.innerWidth, context.maxWindowWidth)
	    * context.displayRatio);

	window.addEventListener('resize', this.resizeMap);

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Grid container className={classes.content}>
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
  				{node.user.name} - {new Date(node.created).toDateString()}
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
		</Grid>
		<Typography variant="body2" className={classes.link}>
		  <Confirmation
		    onClick={() => {window.location = node.link}}
		    autoconfirm
		  >
		    Link to original event
		  </Confirmation>
		</Typography>
		<CustomMarkdown safe source={node.description} />
		<Grid className={classes.infoLeft} item xs={4}>
  		  <Typography variant="body2" className={classes.infoLine}>
		    {'When:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={8}>
  		  <Typography variant="body2" className={classes.infoLine}>
  		    {new Date(node.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid className={classes.infoLeft} item xs={4}>
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
		  <div style={{ height: 20 }}/>
		  <iframe
		      title="google_map"
		      style={{
			  width: width,
			  height: height, 
			  padding: 0,
			  margin: 0,
		      }}
		      src={`https://www.google.com/maps/embed/v1/search?q=${node.latitude}%2C%20${node.longitude}&key=${config.maps.google.key}&zoom=11`}
		      allowFullScreen
		  >
		  </iframe>
		  <div className={classes.action}>
		    <div className={classes.edgeMutations}>
		      <SimpleEdgeMutation
			  variant={LikeVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasLiked.edges.length === 1}
		          countCallback={likeCallback}
		      />
		      <SimpleEdgeMutation
			  variant={RsvpVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasRsvp.edges.length === 1}
		          countCallback={rsvpCallback}
		      />
		      <SimpleEdgeMutation
			  variant={BookmarkVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasBookmarked.edges.length === 1}
		      />
		      <div className={classes.personDialogWrapper}>
			<PersonDialogList
			    variant={DialogLikeVal}
			    count={likeCount}
			    node={node.id}
			/>
		      </div>
		      <div className={classes.personDialogWrapper}>
			<PersonDialogList
			    variant={DialogRsvpVal}
			    count={rsvpCount}
			    node={node.id}
			/>
		      </div>
		    </div>
		  </div>
		</Grid>
		<Grid item xs={12}>
		  <CommentTree parent={id} context={context} showReplyRoot={true} />
		</Grid>
		<Grid item xs={12}><div className={classes.bottom} /></Grid>
	      </Grid>
	    </Grid>
	);
    }

    render() {
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query}
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
