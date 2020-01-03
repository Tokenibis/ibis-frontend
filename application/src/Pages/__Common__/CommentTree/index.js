import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import { withApollo } from "react-apollo";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';

import Link from '../../../__Common__/CustomLink';
import CustomMarkdown from '../CustomMarkdown';
import CustomDivider from '../../../__Common__/CustomDivider';
import UserDialogList, { LikeVal as DialogLikeVal} from '../UserDialogList';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import Confirmation from '../Confirmation';
import CustomDate from '../CustomDate';

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
    listItem: {
	paddingLeft: 0,
	cursor: 'default',
	margin: 0,
    },
    verticalDivider: {
	borderLeft: '2px solid',
	borderColor: theme.palette.light.main,
	height: '100%',
    },
    date: {
	color: theme.palette.tertiary.main,
    },
    collapse: {
	width: '100%',
    },
    seeMore: {
	fontWeight: 'bold',
	width: '100%',
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
    expandedReplyHeader: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
	paddingTop: theme.spacing(1),
	paddingBottom: theme.spacing(1),
    },
    replyButton: {
	fontWeight: 'bold',
	cursor: 'pointer',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    confirmationWrapper: {
	marginLeft: 'auto',
    },
    submitButton: {
	textTransform: 'none',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    submitButtonDisabled: {
	textTransform: 'none',
	opacity: '50%',
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    },
    spacer: {
	height: theme.spacing(3),
    },
    textField: {
	'& .MuiOutlinedInput-root': {
	    'color': theme.palette.tertiary.main,
	    '& inputMultiline': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '& fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '&:hover fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	    '&.Mui-focused fieldset': {
		borderColor: theme.palette.tertiary.main,
	    },
	},
    },
})

const query = loader('../../../Static/graphql/operations/CommentTree.gql')

const create_mutation = loader('../../../Static/graphql/operations/CommentCreate.gql')


class CommentTree extends Component {

    constructor() {
	super();
	this.state = {
	    seeMoreState: false,
	    showReplyChild: new Set(),
	    enableSubmit: false,
	}
    }

    toggleSeeMore() {
	this.setState({ seeMore: !this.state.seeMore })
    };

    onSubmitSelf() {
	let { parent } = this.props;
	document.getElementById(`reply_form_${parent}`).value = '';
    };

    onSubmitChild(id) {
	let { showReplyChild } = this.state;

	if (showReplyChild.has(id)) {
	    showReplyChild.delete(id)
	} else {
	    showReplyChild.add(id)
	}
	this.setState({ showReplyChild })
    };

    renderReplyForm(depth, refetch) {

	let { classes, client, context, parent, onSubmitRoot, replyFocused } = this.props;
	let { enableSubmit } = this.state;

	let submit = () => {
	    let description = document.getElementById(`reply_form_${parent}`).value

	    return client.mutate({
		mutation: create_mutation,
		variables: {
		    user: context.userID,
		    parent, 
		    description,
		    self: context.userID,
		},
	    }).then(response => {
		onSubmitRoot && onSubmitRoot();
		this.onSubmitSelf();
		this.setState({ enableSubmit: false });
		refetch();
	    }).catch(error => {
		console.log(error);
	    });
	};

	let handleChange = () => {
	    let { enableSubmit } = this.state;
	    let length = document.getElementById(`reply_form_${parent}`).value.length;

	    if ( !enableSubmit && length > 0) {
		this.setState({ enableSubmit: true });
	    } else if ( enableSubmit && length === 0) {
		this.setState({ enableSubmit: false });
	    }
	}

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
		<TextField
		    id={`reply_form_${parent}`}
		    required
		    defaultValue=""
 		    className={classes.textField}
		    onChange={() => handleChange()}
		    margin="normal"
		    variant="outlined"
		    fullWidth
		    multiline
		    autoFocus={replyFocused}
		    placeholder="Leave a reply"
		/>
		<Grid container direction="column">
		  <div className={classes.confirmationWrapper}>
		    <Confirmation
			disabled={!enableSubmit}
			onClick={() => submit()}
			message="Are you sure you want to __submit__ this comment?"
			preview={() => (document.getElementById(`reply_form_${parent}`).value)}
		    >
		      <Button>
			<Typography
			  variant="body2"
			  className={enableSubmit ? classes.submitButton : classes.submitButtonDisabled}
			>
			  Submit
			</Typography>
		      </Button>
		    </Confirmation>
		  </div>
		</Grid>
	      </Grid>
	    </Grid>
	);
    };

    renderComment(node, depth) {
	let { classes, context  } = this.props;
	let { showReplyChild } = this.state;

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
		    className={classes.listItem}
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
			      @{node.user.username} - <CustomDate date={node.created} />
  			    </Typography>
			  </div>
		      } 
		  />
		</ListItem>
		<CustomMarkdown source={node.description} />
	      </Grid>
	      {
		  [...Array(depth).keys()].map((i) => (
		      <Grid item xs={1} key={i}>
			<div className={classes.verticalDivider}/>
		      </Grid>
		  ))
	      }
	      <Grid item xs={12 - depth}>
		<div className={classes.action}>
		  {context.userID === node.user.person.id ? (
		      <UserDialogList
			  variant={DialogLikeVal}
			  count={node.likeCount}
			  node={node.id}
			  hideZero
		      />
		  ):(
		      <SimpleEdgeMutation
			  variant={LikeVal}
			  user={context.userID}
			  target={node.id}
			  initial={node.hasLiked.edges.length === 1}
		      />
		  )}
		  <Typography
		      variant="body2"
		      className={classes.replyButton}
		      onClick={(e) => {this.onSubmitChild(node.id)}}
		  >
		    {
			showReplyChild.has(node.id) ?
			'Discard' :
			'Reply'
		    }
		  </Typography>
		</div>
	      </Grid>
	    </Grid>
	)
    };

    renderCommentTree(depth, data) {
	let { classes, client, context } = this.props;
	let { showReplyChild } = this.state;

	return (
	    data[Object.keys(data)[0]].edges.map((item) => (
		<div>
		  {this.renderComment(item.node, depth)}
		  <CommentTree
		      client={client}
		      depth={depth + 1}
		      parent={item.node.id}
		      showReplyRoot={showReplyChild.has(item.node.id)}
		      onSubmitRoot={() => this.onSubmitChild(item.node.id)}
		      replyFocused={true}
		      context={context}
		      classes={classes}
		  />
		</div>
	    ))
	);
    };

    renderSeeMore(depth, data) {
	let { classes } = this.props;
	let { seeMore } = this.state;

	let seeMoreButton = (
	    <Grid item xs={12 - depth}>
	      <Typography
		  variant="body2"
		  className={classes.seeMore}
		  onClick={(e) => {this.toggleSeeMore()}}
	      >
		See more replies
	      </Typography>
	    </Grid>
	);

	let expandedReplies = (
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
		    Replies
		  </Typography>
		  <Typography
		      variant="body2"
		      className={classes.hideReplies}
		      onClick={(e) => {this.toggleSeeMore()}}
		  >
		    Hide replies
		  </Typography>
		</div>
		<CustomDivider/>
	      </Grid>
	      <Grid item xs={12}>
		{this.renderCommentTree(0, data)}
	      </Grid>
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
		    Replies
		  </Typography>
		  <Typography
		      variant="body2"
		      className={classes.hideReplies}
		      onClick={(e) => {this.toggleSeeMore()}}
		  >
		    Hide replies
		  </Typography>
		</div>
		<CustomDivider/>
		<div className={classes.spacer}/>
	      </Grid>
	    </Grid>
	);

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
		<Collapse className={classes.collapse} in={!seeMore} timeout="auto" unmountOnExit>
		  {seeMoreButton}
		</Collapse>
	      </Grid>
	      <Collapse className={classes.collapse} in={seeMore} timeout="auto" unmountOnExit>
		{expandedReplies}
	      </Collapse>
	    </Grid>
	);
    };
	    
    render() {
	let { classes, context, parent, depth, showReplyRoot } = this.props;

	// depth will typically be undefined when calling CommentTree externally
	if (!depth) {
	    depth = 0;
	}

	return (
	    <Query
	      fetchPolicy="no-cache"
	      query={query} 
	      variables={{ hasParent: parent, self: context.userID }}
	    >
	      {({ loading, error, data, refetch }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  
		  return (
		      <div>
			<Collapse in={showReplyRoot} timeout="auto" unmountOnExit>
			  {this.renderReplyForm(depth, refetch)}
			</Collapse>
			{
			    depth < MAX_DEPTH ? (
				this.renderCommentTree(depth, data)
			    ):(
				data[Object.keys(data)[0]].edges.length > 0 &&
				this.renderSeeMore(depth, data)
			    )
			}
		      </div>
		  );
	      }}
	    </Query>
	);
    };
};

CommentTree.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    parent: PropTypes.string.isRequired,
};

export default withApollo(withStyles(styles)(CommentTree));
