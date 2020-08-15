import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
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
import UserDialogList, { LikeVal as DialogLikeVal } from '../../__Common__/UserDialogList';
import SimpleEdgeMutation, { LikeVal, BookmarkVal } from '../../__Common__/SimpleEdgeMutation';
import CommentTree from '../../__Common__/CommentTree';
import CustomDate from '../../__Common__/CustomDate';

const styles = theme => ({
    content: {
	width: '90%',
    },
    avatar: {
	backgroundColor: 'white',
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

class News extends Component {

    state = {
	likeCount: null,
    }

    createPage(node) {
	let { classes, context, id } = this.props;
	let { likeCount } = this.state;
	
	let likeCallback = (change) => {
	    this.setState({ likeCount: node.likeCount + change });
	}
	if (likeCount === null) {
	    this.setState({ likeCount: node.likeCount });
	}

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
			  to={`/Organization/Organization?id=${node.user.id}`}
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
  				@{node.user.username} — <CustomDate date={node.created} />
  			      </Typography>
			    </div>
			}
		    />
		  </ListItem>
  		  <CardMedia
  		      title={node.title}
  		  >
		    <img alt="News" className={classes.img} src={node.image} />
		  </CardMedia>
		  <Typography variant="body2" className={classes.link}>
		    {node.link && 
		     <Confirmation
		       onClick={() => {window.location = node.link}}
		       autoconfirm
			 >
		       Link to original article
		     </Confirmation>
		    }
		  </Typography>
		  <CustomMarkdown
		      safe source={node.description}
		      mention={node.mention && Object.fromEntries(node.mention.edges.map(x => [
			  x.node.username,
			  [x.node.id, x.node.userType],
		      ]))}
		  />
		  {new Date(node.modified) - new Date(node.created) > 1000 * 10 &&
  		   <Typography variant="body2" className={classes.edited}>
  		     (Edited on <CustomDate variant="precise" date={node.modified} />)
  		   </Typography>
		  }
		  <div className={classes.action}>
		    {context.userID === node.user.id ? (
			<div className={classes.edgeMutationsEdit}>
			  <div className={classes.likeBookmark}>
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
			  </div>
			  <IconButton
			      component={Link}
			      to={`NewsMutate?id=${node.id}`}
			      className={classes.editButton}
			    >
			    <EditIcon/>
			  </IconButton>
			</div>

		    ):(
			<div className={classes.edgeMutations}>
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
	let { classes, context, id } = this.props;

	let query = loader('../../Static/graphql/app/News.gql')

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query}
		variables={{ id, self: context.userID }}
	    >
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.news);
	      }}
	    </Query>
	);
    };
};

export default withStyles(styles)(News);
