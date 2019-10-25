import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/AddCommentOutlined';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';

import Link from '../../../__Common__/CustomLink';
import CustomDivider from '../../../__Common__/CustomDivider';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';


const MAX_DEPTH = 3;

const styles = theme => ({
    header: {
	display: 'flex',
	alignItems: 'center',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    verticalDivider: {
	borderLeft: '2px solid',
	borderColor: theme.palette.light.main,
	height: '100%',
    },
    verticalDividerThick: {
	borderLeft: '8px solid',
	borderColor: theme.palette.light.main,
	height: '100%',
    },
    date: {
	color: theme.palette.tertiary.main,
    },
    collapse: {
	width: '100%',
    },
    moreReplies: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
    },
    hideReplies: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
    body: {
	textAlign: 'left',
	color: theme.palette.tertiary.main,
    },
    expandedReplyHeader: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
    },
    commentIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.secondary.main,
    },
    replyButton: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    commentIcon: {
	marginLeft: 'auto',
	color: theme.palette.secondary.main,
    },
    spacer: {
	height: theme.spacing(5),
    },
})

// three layer deep nested comments
const QUERY = gql`
    query CommentTree($hasParent: String! $self: String) {
	allComments(hasParent: $hasParent orderBy: "-created") {
	    edges {
		node {
		    id
		    description
		    created
		    user {
			id
			name
			username
			avatar
			person {
			    id
			}
		    }
		    hasLiked: like(id: $self) {
			edges {
			    node {
				id
			    }
			}
		    }
		    entryPtr {
			id
			commentCount
		    }
		}
	    }
	}
    }
`;

function WriteComment({ classes, placeholder }) {
    return (
	<TextField
	required
	defaultValue=""
	className={classes.textField}
	margin="normal"
	variant="outlined"
	fullWidth
	multiline
	placeholder={placeholder}
	/>
    );
};

class CommentTree extends Component {

    constructor() {
	super();
	this.state = {
	    expandedInput: '',
	    expandedReplies: new Set(),
	}
    }

    handleExpandReplies(id) {
	let { expandedReplies } = this.state;
	if (expandedReplies.has(id)) {
	    expandedReplies.delete(id)
	} else {
	    expandedReplies.add(id)
	}
	this.setState({ expandedReplies })
    };

    handleExpandInput(id) {
	let { expandedInput } = this.state;

	if (expandedInput === id) {
	    this.setState({ expandedInput: '' })
	} else {
	    this.setState({ expandedInput: id })
	}
    };

    renderMoreReplies(node, depth) {
	let { classes } = this.props;
	let { expandedReplies } = this.state;

	return (
	    <Grid container>
	      {
		  [...Array(depth).keys()].map((i) => (
		      <Grid item xs={1}>
			<div className={classes.verticalDivider}/>
		      </Grid>
		  ))
	      }
	    {
		!expandedReplies.has(node.id) ?
		<Grid item xs={12 - depth}>
		  <Typography
		      variant="body2"
		      className={classes.moreReplies}
		      onClick={(e) => {this.handleExpandReplies(node.id)}}
		  >
		    See more replies
		  </Typography>
		</Grid> :
		<Grid container>
		  <Grid item xs={12}>
		    <div className={classes.spacer}/>
		  </Grid>
		  <Grid item xs={12}>
		    <CustomDivider/>
		    <div className={classes.action}>
		      <Typography
			  variant="body2"
			  className={classes.expandedReplyHeader}
		      >
			Replies to {node.user.name}
		      </Typography>
		      <Typography
			  variant="body2"
			  className={classes.hideReplies}
			  onClick={(e) => {this.handleExpandReplies(node.id)}}
		      >
			Hide
		      </Typography>
		    </div>
		    <CustomDivider/>
		  </Grid>
		  <Grid item xs={12}>
		    {this.renderCommentTree(node.id, 0)}
		  </Grid>
		  <Grid item xs={12}>
		    <CustomDivider/>
		    <div className={classes.action}>
		      <Typography
			  variant="body2"
			  className={classes.expandedReplyHeader}
		      >
			Replies to {node.user.name}
		      </Typography>
		      <Typography
			  variant="body2"
			  className={classes.hideReplies}
			  onClick={(e) => {this.handleExpandReplies(node.id)}}
		      >
			Hide
		      </Typography>
		    </div>
		    <CustomDivider/>
		  </Grid>
		  <Grid item xs={12}>
		    <div className={classes.spacer}/>
		  </Grid>
		</Grid>
	    }
	    </Grid>
	);
    }
    
    renderComment(node, depth) {
	let { classes, context } = this.props;
	let { expandedInput } = this.state;

	let initial_vote;
	
	return (
	    <Grid container>
	      {
		  [...Array(depth).keys()].map((i) => (
		      <Grid item xs={1}>
			<div className={classes.verticalDivider}/>
		      </Grid>
		  ))
	      }
	      <Grid item xs={12 - depth}>
		<ListItem
		    button
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
			  <div >
			    <Typography
			      variant="body2"
			      className={classes.title}
			    >
			      {node.user.name}
			    </Typography>
  			    <Typography variant="body2" className={classes.subtitle}>
  			      {node.user.username}
  			    </Typography>
			  </div>
		      } 
		  />
		</ListItem>
		<Typography variant="body2" className={classes.body}>
		  {node.description}
		</Typography>
	      </Grid>
	      {
		  [...Array(depth).keys()].map((i) => (
		      <Grid item xs={1}>
			<div className={classes.verticalDivider}/>
		      </Grid>
		  ))
	      }
	      <Grid item xs={12 - depth}>
		<div className={classes.action}>
		  <SimpleEdgeMutation
		      variant={LikeVal}
		      user={context.userID}
		      target={node.id}
		      initial={node.hasLiked.edges.length === 1}
		  />
  		  <Typography variant="body2" className={classes.date}>
  		    {new Date(node.created).toDateString()}
  		  </Typography>
		  <Typography
		      variant="body2"
		      className={classes.replyButton}
		      onClick={(e) => {this.handleExpandInput(node.id)}}
		  >
		    Reply
		  </Typography>
		</div>
	      </Grid>
	      <Collapse
		  in={expandedInput === node.id}
		  timeout="auto"
		  unmountOnExit
		  className={classes.collapse}
	      >
		<Grid container>
		  {
		      [...Array(depth).keys()].map((i) => (
			  <Grid item xs={1}>
			    <div className={classes.verticalDivider}/>
			  </Grid>
		      ))
		  }
		  <Grid item xs={12 - depth} className={classes.divider}>
		    <div className={classes.action}>
		      <WriteComment classes={classes} placeholder="Leave a reply" />
		    </div>
		  </Grid>
		</Grid>
	      </Collapse>
	    </Grid>
	)
    }

    renderCommentTree(parent, depth) {
	let { classes, context } = this.props;

	return (
	    <Query
	      fetchPolicy="no-cache"
	      query={QUERY} 
	      variables={{ hasParent: parent, self: context.userID }}
	    >
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return (
		      <div>
			{
			    data[Object.keys(data)[0]].edges.map((item) => (
				<div>
				  {
				      this.renderComment(item.node, depth)
				  }
				  {
				      item.node.entryPtr.commentCount > 0 && (
					  depth + 1 < MAX_DEPTH ? 
					  this.renderCommentTree(item.node.id, depth + 1) :
					  this.renderMoreReplies(item.node, depth + 1)
				      )
				  }
				</div>
			    ))
			}
		      </div>
		  );
	      }}
	    </Query>
	);
    };

    render() {
	let { classes, parent, context } = this.props
	return (
	    <div>
	      <WriteComment classes={classes} placeholder="Leave a comment" />
	      {this.renderCommentTree(parent, 0)}
	      <div className={classes.spacer}/>
	    </div>
	);

    };
};

CommentTree.propTypes = {
    classes: PropTypes.object.isRequired,
    parent: PropTypes.string.isRequired,
};

export default withStyles(styles)(CommentTree);
