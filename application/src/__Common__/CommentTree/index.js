import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
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

import Link from '../CustomLink';
import CustomMarkdown from '../CustomMarkdown';
import UserDialogList, { LikeVal as DialogLikeVal} from '../UserDialogList';
import SimpleEdgeMutation, { LikeVal } from '../SimpleEdgeMutation';
import Confirmation from '../Confirmation';
import CustomDate from '../CustomDate';
import EntryTextField from '../../__Common__/EntryTextField';

const MAX_DEPTH = 3;

const styles = theme => ({
    header: {
	display: 'flex',
	alignItems: 'center',
    },
    avatar: {
	backgroundColor: 'white',
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
	cursor: 'pointer',
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

const query = loader('../../Static/graphql/app/CommentList.gql')

const create_mutation = loader('../../Static/graphql/app/CommentCreate.gql')


class CommentTree extends Component {

    constructor() {
	super();
	this.state = {
	    seeMoreState: false,
	    showReplyChild: new Set(),
	    enableSubmit: false,
	    mention: [],
	    data: null,
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

    onSubmitBottom(id) {
	let { parent } = this.props;

	this.onSubmitChild(id)
	this.setState({ data: null });
	this.fetchComments(parent);
    }

    renderReplyForm(depth) {

	let { classes, client, context, parent, onSubmitRoot, replyFocused } = this.props;
	let { enableSubmit, mention } = this.state;

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
		if (depth < MAX_DEPTH) {
		    this.setState({ enableSubmit: false, data: null });
		    this.fetchComments(parent);
		}
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
		<EntryTextField
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
		    addMention={(x) => this.setState({ mention: Object.assign({}, mention, x)})}
		/>
		<Grid container direction="column">
		  <div className={classes.confirmationWrapper}>
		    <Confirmation
			disabled={!enableSubmit}
			onClick={() => submit()}
			message="Are you sure you want to __submit__ this comment?"
			preview={() => (document.getElementById(`reply_form_${parent}`).value)}
			mention={mention}
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
	let { classes, context } = this.props;
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
			to={`/${node.user.userType}?id=${node.user.id}`}
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
		{depth === MAX_DEPTH && (
		    <CustomMarkdown
			source={`___@${node.parent.comment.user.username}:___\n`}
		    />
		)}
		<CustomMarkdown
		    source={node.description}
		    mention={node.mention && Object.fromEntries(node.mention.edges.map(x => [
			x.node.username,
			[x.node.id, x.node.userType],
		    ]))}
		/>
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
		  {context.userID === node.user.id ? (
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

    renderCommentTree(depth) {
	let { classes, client, context } = this.props;
	let { data, showReplyChild } = this.state;

	return (
	    data.map((item) => (
		<div>
		  {this.renderComment(item.node, depth)}
		  <CommentTree
		      client={client}
		      depth={depth + 1}
		      parent={item.node.id}
		      showReplyRoot={showReplyChild.has(item.node.id)}
		      onSubmitRoot={() => depth === MAX_DEPTH ? (
			  this.onSubmitBottom(item.node.id)
		      ):(
			  this.onSubmitChild(item.node.id)
		      )}
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
		  <Grid item xs={12 - depth}>
		    <Typography
			variant="body2"
			className={classes.seeMore}
			onClick={(e) => {this.toggleSeeMore()}}
		    >
		      See more replies
		    </Typography>
		  </Grid>
		</Collapse>
	      </Grid>
	      <Collapse className={classes.collapse} in={seeMore} timeout="auto" unmountOnExit>
		{this.renderCommentTree(depth, seeMore)}
	      </Collapse>
	    </Grid>
	);
    };

    fetchComments(node) {
	let { client, context, depth } = this.props;

	if (depth > MAX_DEPTH) {
	    this.setState({ data: []});
	    return
	}

	client.query({
	    fetchPolicy: "no-cache",
	    query: query,
	    variables: { parent: node, self: context.userID },
	}).then(response => {
	    if (depth === MAX_DEPTH) {
		let { data } = this.state;
		if (data === null) {
		    data = [];
		}
		let new_data = response.data[Object.keys(response.data)[0]].edges;
		data = data.concat(new_data);
		data.sort((a, b) => {
		    if (new Date(a.node.created) > new Date(b.node.created)) {
			return 1;
		    } else if (new Date(a.node.created) < new Date(b.node.created)) {
			return -1;
		    } else {
			return 0
		    }
		});
		this.setState({ data });
		new_data.forEach(child => { this.fetchComments(child.node.id) })
	    } else {
		this.setState({ data: response.data[Object.keys(response.data)[0]].edges });
	    }
	});
    }

    componentDidMount() {
	let { parent } = this.props;
	this.fetchComments(parent);
    }
	    
    render() {
	let { classes, depth, showReplyRoot } = this.props;
	let { data } = this.state;

	// depth will typically be undefined when calling CommentTree externally
	if (!depth) {
	    depth = 0;
	}

	if (!data) {
	    return <LinearProgress className={classes.progress} />;
	} else {
	    return (
		<div>
		  <Collapse in={showReplyRoot} timeout="auto" unmountOnExit>
		    {this.renderReplyForm(depth)}
		  </Collapse>
		  {depth <= MAX_DEPTH && this.renderCommentTree(depth)}
		</div>
	    );
	}
    };
};

CommentTree.propTypes = {
    classes: PropTypes.object.isRequired,
    context: PropTypes.object.isRequired,
    parent: PropTypes.string.isRequired,
};

export default withApollo(withStyles(styles)(CommentTree));
