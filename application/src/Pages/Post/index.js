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
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import CustomMarkdown from '../__Common__/CustomMarkdown';
import PersonDialogList, { LikeVal as DialogLikeVal} from '../__Common__/PersonDialogList';
import SimpleEdgeMutation, { LikeVal, BookmarkVal } from '../__Common__/SimpleEdgeMutation';
import CommentTree from '../__Common__/CommentTree';
import CustomDate from '../__Common__/CustomDate';

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
    likeBookmark: {
	display: 'flex',
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
});

const query = loader('../../Static/graphql/operations/Post.gql')

class Post extends Component {

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
	      <Grid className={classes.content} item xs={12}>
		<Grid item xs={12}>
		  <ListItem
		      className={classes.image}
		  >
		    <ListItemIcon>
    		      <Avatar
		      component={Link}
		      prefix={1}
		      to={`Person?id=${node.user.person.id}`}
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
  				{node.user.name} - <CustomDate date={node.created} />
  			      </Typography>
			    </div>
			}
		    />
		  </ListItem>
		  <CustomMarkdown source={node.description} />
		  <div className={classes.action}>
		    {context.userID === node.user.person.id ? (
			<div className={classes.personDialogWrapper}>
			  <PersonDialogList
			      variant={DialogLikeVal}
			      count={likeCount}
			      node={node.id}
			  />
			</div>
		    ):(
			<div className={classes.likeBookmark}>
			  <SimpleEdgeMutation
			      variant={LikeVal}
			      user={context.userID}
			      target={node.id}
			      initial={node.hasLiked.edges.length === 1}
		              countCallback={likeCallback}
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
		  return this.createPage(data.post);
	      }}
	    </Query>
	);
    };
};

export default withStyles(styles)(Post);
