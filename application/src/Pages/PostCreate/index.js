import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Mutation } from "react-apollo";
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withRouter } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(2),
	width: '90%',
    },
    actionPost: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(3),
    },
    recipient: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    name: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    label: {
	paddingTop: theme.spacing(2),
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    buttonWrapper: {
	paddingTop: theme.spacing(2),
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
    dialogInner: {
	padding: theme.spacing(4),
    },
    message: {
	paddingBottom: theme.spacing(4),
	textAlign: 'center',
    },
    action: {
	textAlign: 'center',
    },
    dialogButton: {
	paddingLeft: theme.spacing(6),
	paddingRight: theme.spacing(6),
	marginLeft: theme.spacing(2),
	marginRight: theme.spacing(2),
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
    },
});

const create_mutation = loader('../../Static/graphql/operations/PostCreate.gql')

class PostCreate extends Component {

    state = {
	amount: '0.00',
	enablePost: false,
	openedConfirmation: false,
    };

    handlePost(mutation) {
	this.setState({ enablePost: false, openedConfirmation: true });
    }

    handleYes(mutation) {
	let { context, history } = this.props;

	let title = document.getElementById(`post_title`).value;
	let description = document.getElementById(`post_description`).value;

	mutation({ variables: {
	    user: context.userID,
	    title,
	    description,
	}}).then(response => {
	    let url = new URL(window.location.href);
	    let path = url.hash.split('/').slice(1);
	    let post_id = response.data.createPost.post.id
	    history.push(`/${path[0]}/Post?id=${post_id}`)
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
    }

    handleClose() {
	this.setState({ openedConfirmation: false, enablePost: true });
    }

    handleChange() {
	let enablePost = document.getElementById('post_title').value.length && 
			 document.getElementById('post_description').value.length > 0;
	this.setState({ enablePost });
    }

    render() {
	let { classes } = this.props;
	let { enablePost, openedConfirmation } = this.state;

	return (
	    <div>
	      <Dialog
		  open={openedConfirmation}
		  onClose={(e) => this.handleClose()}
	      >
		<div className={classes.dialogInner}>
		  <div className={classes.message}>
		    <Typography variant="body2">
		      Are you sure you want to submit this post?
		    </Typography>
		  </div>
		  <div className={classes.action}>
		    <Mutation mutation={create_mutation}>
		      {mutation => (
			  <Button
			      className={classes.dialogButton}
			      onClick={() => this.handleYes(mutation)}
			      >
			    Yes
			  </Button>
		      )}
		    </Mutation>
		    <Button
			className={classes.dialogButton}
			onClick={() => this.handleClose()}
		    >
		      No
		    </Button>
		  </div>
		</div>
	      </Dialog>
  	      <Grid container direction="column" justify="center" alignItems="center" >
		<Grid container className={classes.content}>
		  <Grid item xs={12}>
		    <TextField
			id="post_title"
			autoFocus
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			placeholder="Title"
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12}>
		    <TextField
			id="post_description"
			required
			defaultValue=""
 			className={classes.textField}
			margin="normal"
			variant="outlined"
			fullWidth
			multiline
			rows={5}
			placeholder="Post"
			onChange={() => this.handleChange()}
		    />
		  </Grid>
		  <Grid item xs={12} className={classes.buttonWrapper}>
		    <Button
		      disabled={!enablePost}
		      onClick={() => this.handlePost()}
		      className={classes.actionPost}
		    >
		      Post
		    </Button>
		  </Grid>
		</Grid>
	      </Grid>
	    </div>
	);
    };
};

PostCreate.propTypes = {
    classes: PropTypes.object.isRequired,
    variant: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired,
    target: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
};

export const DonationVal = 'donation';
export const TransactionVal = 'transaction';

export default withRouter(withStyles(styles)(PostCreate));
