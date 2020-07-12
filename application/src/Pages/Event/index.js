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
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import Link from '../../__Common__/CustomLink';
import Confirmation from '../../__Common__/Confirmation';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import UserDialogList, {
    LikeVal as DialogLikeVal,
    RsvpVal as DialogRsvpVal,
} from '../../__Common__/UserDialogList';
import SimpleEdgeMutation, { LikeVal, BookmarkVal, RsvpVal } from '../../__Common__/SimpleEdgeMutation';
import CommentTree from '../../__Common__/CommentTree';
import CustomDate, { PreciseVal, LongVal } from '../../__Common__/CustomDate';

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
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    editButton: {
	color: theme.palette.secondary.main,
    },
    edited: {
	paddingTop: theme.spacing(),
	color: theme.palette.tertiary.main,
	fontStyle: 'italic',
    },
    edgeMutationsEdit: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
    },
    edgeMutations: {
	display: 'flex',
    },
    description: {
	paddingBottom: theme.spacing(1),
    },
    infoLeft: {
	marginLeft: 'auto',
    },
    infoRight: {
	marginRight: 'auto',
    },
    label: {
	fontWeight: 'bold',
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
    },
    info: {
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    img: {
	width: '100%',
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

const query = loader('../../Static/graphql/app/Event.gql')

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

	window.addEventListener('resize', this.resizeMap);

	let searchAddress = node.address.replace(/\./g, '').replace(/\s+/g, '+')

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
		      to={`/Nonprofit/Nonprofit?id=${node.user.nonprofit.id}`}
  		      alt="Ibis"
    		      src={node.user.avatar}
    		      className={classes.avatar}
		      />
		    </ListItemIcon>
		    <ListItemText
			primary={
			    <div>
  			      <Typography variant="body2" className={classes.title}>
  				{node.title}
  			      </Typography>
  			      <Typography variant="body2" className={classes.subtitle}>
  				@{node.user.username} - <CustomDate variant={PreciseVal} date={node.date} />
  			      </Typography>
			    </div>
			}
		    />
		  </ListItem>
  		  <CardMedia
  		      title={node.title}
  		  >
		    <img alt="Event" className={classes.img} src={node.image} />
		  </CardMedia>
		</Grid>
		<Grid item xs={12}>
		  {node.link && 
		   <Typography variant="body2" className={classes.link}>
		     <Confirmation
		       onClick={() => {window.location = node.link}}
		       autoconfirm
		       >
		       Link to original event
		     </Confirmation>
		   </Typography>
		  }
		</Grid>
		<Grid item xs={12} className={classes.description}>
		  <CustomMarkdown
		      safe source={node.description}
		      mention={node.mention && Object.fromEntries(node.mention.edges.map(x => [
			  x.node.username,
			  x.node.nonprofit ?
			  [x.node.nonprofit.id, 'nonprofit'] :
			  [x.node.person.id, 'person'],
		      ]))}
		  />
		</Grid>
		<Grid className={classes.infoLeft} item xs={3}>
  		  <Typography variant="body2" className={classes.label}>
		    {'Who:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={9}>
  		  <Typography variant="body2" className={classes.info}>
		    {node.user.name}
		  </Typography>
		</Grid>
		<Grid className={classes.infoLeft} item xs={3}>
  		  <Typography variant="body2" className={classes.label}>
		    {'When:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={9}>
  		  <Typography variant="body2" className={classes.info}>
		    {
			CustomDate({
			    variant: LongVal,
			    date: node.date,
			    duration: node.duration
			}).split('\n').map((item, key) => (
			    <span key={key}>{item}<br/></span>
			))
		    }
		  </Typography>
		</Grid>
		<Grid className={classes.infoLeft} item xs={3}>
  		  <Typography variant="body2" className={classes.label}>
		    {'Where:'}
		  </Typography>
		</Grid>
		<Grid className={classes.infoRight} item xs={9}>
  		  <Typography variant="body2" className={classes.info}>
		    {node.address ? (
			node.address.split('\n').map((item, key) => (
			    <span key={key}>{item}<br/></span>
			))
		    ):(
			'Please see description'
		    )}
		  </Typography>
		</Grid>
		<Grid className={classes.content} item xs={12}>
		  <div style={{ height: 20 }}/>
		  {node.address && 
		   <iframe
		       title="google_map"
		       style={{
			   width: width,
			   height: height, 
			   padding: 0,
			   margin: 0,
		       }}
		       src={`https://www.google.com/maps/embed/v1/search?q=${searchAddress}&key=${config.maps.google.key}&zoom=11`}
		       allowFullScreen
		       >
		   </iframe>
		  }
		  {new Date(node.modified) - new Date(node.created) > 1000 * 10 &&
  		   <Typography variant="body2" className={classes.edited}>
  		     (Edited on <CustomDate variant="precise" date={node.modified} />)
  		   </Typography>
		  }
		  <div className={classes.action}>
		    {context.userID === node.user.id ? (
			<div className={classes.edgeMutationsEdit}>
			  <div className={classes.edgeMutations}>
			    <SimpleEdgeMutation
				variant={BookmarkVal}
				user={context.userID}
				target={node.id}
				initial={node.hasBookmarked.edges.length === 1}
			    />
			    <div className={classes.personDialogWrapper}>
			      <UserDialogList
			      variant={DialogLikeVal}
			      count={likeCount}
			      node={node.id}
			      />
			    </div>
			    <div className={classes.personDialogWrapper}>
			      <UserDialogList
			      variant={DialogRsvpVal}
			      count={rsvpCount}
			      node={node.id}
			      />
			    </div>
			  </div>
			  <IconButton
			      component={Link}
			      to={`EventMutate?id=${node.id}`}
			      className={classes.editButton}
			    >
			    <EditIcon/>
			  </IconButton>
			</div>

		    ):(
			<div className={classes.edgeMutations}>
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
			  <SimpleEdgeMutation
			      variant={LikeVal}
			      user={context.userID}
			      target={node.id}
			      initial={node.hasLiked.edges.length === 1}
		              countCallback={likeCallback}
			  />
			  <div className={classes.personDialogWrapper}>
			    <UserDialogList
				variant={DialogLikeVal}
				count={likeCount}
				node={node.id}
			    />
			  </div>
			  <div className={classes.personDialogWrapper}>
			    <UserDialogList
				variant={DialogRsvpVal}
				count={rsvpCount}
				node={node.id}
			    />
			  </div>
			</div>
		    )}
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
