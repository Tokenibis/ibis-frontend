import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from "react-apollo";
import { loader } from 'graphql.macro';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import UsernameIcon from '@material-ui/icons/FontDownloadOutlined';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PasswordIcon from '@material-ui/icons/LockOutlined';
import PublicIcon from '@material-ui/icons/Public';
import FollowingIcon from '@material-ui/icons/People';
import FollowIcon from '@material-ui/icons/HowToReg';
import DonationIcon from '@material-ui/icons/MonetizationOnOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import CommentIcon from '@material-ui/icons/Comment';
import DepositIcon from '@material-ui/icons/LocalAtm';
import MeIcon from '@material-ui/icons/PersonOutlined';
import EditIcon from '@material-ui/icons/Edit';
import SubmitIcon from '@material-ui/icons/DoneOutline';
import CancelIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import axios from "axios";

import CustomDivider from '../../__Common__/CustomDivider';
import CustomMarkdown from '../../__Common__/CustomMarkdown';


const styles = theme => ({
    root: {
	width: '100%',
	paddingTop: theme.spacing(3),
	backgroundColor: theme.palette.background.paper,
	fontWeight: 'bold',
    },
    subheader: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    text: {
	color: theme.palette.primary.main,
    },
    fine: {
	fontSize: '12px',
	color: theme.palette.tertiary.main,
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    button: {
	color: theme.palette.secondary.main,
    },
    disabledButton: {
	color: theme.palette.secondary,
	pointerEvents: 'none',
	opacity: '50%',
    },
    edit: {
	paddingRight: theme.spacing(2),
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
});

const MIN_USERNAME_LEN = 3

const MAX_USERNAME_LEN = 15

const query = loader('../../Static/graphql/operations/Settings.gql')

const person_mutation = loader('../../Static/graphql/operations/PersonSettingsUpdate.gql')

const nonprofit_mutation = loader('../../Static/graphql/operations/NonprofitSettingsUpdate.gql')

const notifier_mutation = loader('../../Static/graphql/operations/NotifierSettingsUpdate.gql')

class Settings extends Component {

    state = {
	dialog: '',
	username: null,
	email: null,
	editField: '',
	canSubmit: false,
    };

    updateUsername = (mutation, refetch) => {
	let username = document.getElementById('edit_username').value;
	mutation({ variables: { username } }).then(response => {
	    refetch();
	    this.setState({ editField: '' });
	}).catch(error => {
	    if (error.toString().includes('UNIQUE constraint failed')) {
		this.setState({ dialog: `Sorry, that username is already taken. Please pick another one, or consider sending a bribe to __@${username}__ for naming rights (ibis tokens only, of course...)` })
	    } else {
		alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	    }
	});
    }

    updateEmail = (mutation, refetch) => {
	let email = document.getElementById('edit_email').value;
	mutation({ variables: { email } }).then(response => {
	    refetch();
	    this.setState({ editField: '' });
	}).catch(error => {
	    alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	});
    }

    updateSetting = (mutation, refetch, key, value) => {
	mutation({ variables: {
	    [key]: value,
	}}).then(response => {
	    refetch();
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	});
    }

    handleUsernameInput(current) {
	let username = document.getElementById('edit_username').value.toString()
	username = username.replace(/[^a-z0-9_]/g, '').slice(0, MAX_USERNAME_LEN)

	let canSubmit = username !== current && username.length >= MIN_USERNAME_LEN;
	this.setState({ username, canSubmit });
    }

    handleEmailInput(current) {
	let email = document.getElementById('edit_email').value.toString()
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let canSubmit = email !== current && re.test(email.toLowerCase());
	this.setState({ email, canSubmit });
    }

    handlePasswordInput(current) {
	let password_old = document.getElementById('password_old').value.toString()
	let password_new = document.getElementById('password_new').value.toString()
	let password_confirm = document.getElementById('password_confirm').value.toString()
	this.setState({
	    canSubmit: password_old &&
		       password_new &&
		       password_confirm &&
		       password_old !== password_new &&
		       password_new === password_confirm
	});
    }

    updatePassword() {
	let password_old = document.getElementById('password_old').value.toString()
	let password_new = document.getElementById('password_new').value.toString()

	axios('/ibis/change-pass/', {
	    method: 'post',
	    withCredentials: true,
	    data: { password_old, password_new },
	}).then(response => {
	    if (response.data.success) {
		this.setState({ editField: '' });
	    }
	    alert(response.data.message);
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	    alert('Hmm... an unexpected error. Please report this bug at info@tokenibis.org')
	})
    }

    inner(data, refetch, user_mutation, notifier_mutation) {

	let { classes, context } = this.props;
	let {
	    dialog,
	    username,
	    email,
	    editField,
	    canSubmit,
	} = this.state;

	return (
	    <div className={classes.root}>
	      <Dialog
		  open={!!dialog}
		  onClose={() => this.setState({ dialog: ''})}
	      >
		<div className={classes.dialogInner}>
		  <CustomMarkdown noLink source={dialog}/>
		</div>
	      </Dialog>
	      <List
		  subheader={
		      <ListSubheader disableSticky className={classes.subheader}>
			{context.userType === 'person' ? 'Personal Info' : 'Organizational Info'}
		      </ListSubheader>
		  }
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <UsernameIcon />
		  </ListItemIcon>
		  {editField === 'username' ? (
		      <div>
			<ListItemText className={classes.edit} primary={
			    <TextField
				id="edit_username"
				    autoFocus
				    required
				    className={classes.textField}
				    margin="normal"
				    variant="outlined"
				    fullWidth
				    value={username !== null ? username: data.ibisUser.username}
				    onInput={() => this.handleUsernameInput(data.ibisUser.username)}
				    InputProps={{
					startAdornment: (
					    <InputAdornment position="start">@</InputAdornment>
					),}}
			    />
			}/>
			<Typography variant="body2" className={classes.fine}>
			  3-15 characters; a-z, 0-9, and _ only
			</Typography>
		      </div>
		  ):(
		      <ListItemText className={classes.text} primary="Change Username" />
		  )}
		  <ListItemSecondaryAction>
		    {editField === 'username' ? (
			<IconButton
			    className={canSubmit ? classes.button : classes.disabledButton}
			    onClick={() => {this.updateUsername(user_mutation, refetch)}}
			    >
			  <SubmitIcon />
			</IconButton>
		    ):(
			<IconButton
			    onClick={() => {this.setState({ editField: 'username' })}}
			    >
			  <EditIcon color="secondary" />
			</IconButton>
		    )}
		  </ListItemSecondaryAction>
		</ListItem>
		{context.userType === 'nonprofit' &&
		 <div>
		   <CustomDivider />
		   <ListItem>
		     <ListItemIcon>
		       <EmailIcon />
		     </ListItemIcon>
		     {editField === 'email' ? (
			 <div>
			   <ListItemText className={classes.edit} primary={
			       <TextField
				   id="edit_email"
				       autoFocus
				       required
				       className={classes.textField}
				       margin="normal"
				       variant="outlined"
				       fullWidth
				       value={email !== null ? email: data.ibisUser.email}
			               onInput={() => this.handleEmailInput(data.ibisUser.email)}
			       />
			   }/>
			   <Typography variant="body2" className={classes.fine}>
			     This change will take effect on your next notification
			   </Typography>
			 </div>
		     ):(
			 <ListItemText className={classes.text} primary="Change Email" />
		     )}
		     <ListItemSecondaryAction>
		       {editField === 'email' ? (
			   <IconButton
			       className={canSubmit ? classes.button : classes.disabledButton}
			       onClick={() => {this.updateEmail(user_mutation, refetch)}}
			       >
			     <SubmitIcon />
			   </IconButton>
		       ):(
			   <IconButton
			       onClick={() => {this.setState({ editField: 'email' })}}
			       >
			     <EditIcon color="secondary" />
			   </IconButton>
		       )}
		     </ListItemSecondaryAction>
		   </ListItem>
		   <CustomDivider />
		   <ListItem>
		     <ListItemIcon>
		       <PasswordIcon />
		     </ListItemIcon>
		     {editField === 'password' ? (
			 <div>
			   <ListItemText className={classes.edit} primary={
			       <TextField
				   id="password_old"
				   type="password"
				   autoFocus
				   required
				   className={classes.textField}
				   margin="normal"
				   variant="outlined"
				   fullWidth
				   label="Old Password"
			           onInput={() => this.handlePasswordInput(data.ibisUser.password)}
			       />
			   }/>
			   <ListItemText className={classes.edit} primary={
			       <TextField
				   id="password_new"
				   type="password"
				   required
				   className={classes.textField}
				   margin="normal"
				   variant="outlined"
				   fullWidth
				   label="New Password"
			           onInput={() => this.handlePasswordInput(data.ibisUser.password)}
			       />
			   }/>
			   <ListItemText className={classes.edit} primary={
			       <TextField
				   id="password_confirm"
				   type="password"
				   required
				   className={classes.textField}
				   margin="normal"
				   variant="outlined"
				   fullWidth
				   label="Confirm Password"
			           onInput={() => this.handlePasswordInput(data.ibisUser.password)}
			       />
			   }/>
			 </div>
		     ):(
			 <ListItemText className={classes.text} primary="Change Password" />
		     )}
		     <ListItemSecondaryAction>
		       {editField === 'password' ? (
			   <div>
			     <div>
			     <IconButton
				 className={canSubmit ? classes.button : classes.disabledButton}
				 onClick={() => {this.updatePassword(user_mutation, refetch)}}
			       >
			       <SubmitIcon />
			     </IconButton>
			     </div>
			     <div>
			     <IconButton
				 className={classes.button}
				 onClick={() => this.setState({ editField: '' })}
			       >
			       <CancelIcon />
			     </IconButton>
			     </div>
			   </div>
		       ):(
			   <IconButton
			       onClick={() => {this.setState({ editField: 'password' })}}
			       >
			     <EditIcon color="secondary" />
			   </IconButton>
		       )}
		     </ListItemSecondaryAction>
		   </ListItem>
		 </div>
		}
	      </List>
	      <List
		  subheader={
		      <ListSubheader disableSticky className={classes.subheader}>
			Email Notifications
		      </ListSubheader>
		  }
		  className={classes.root}
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <FollowIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Follows" />
		  <ListItemSecondaryAction>
		    <Switch
			edge="end"
			checked={data.ibisUser.notifier.emailFollow}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailFollow',
			    !data.ibisUser.notifier.emailFollow,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		{context.userType === 'person' ? (
		    <ListItem>
		      <ListItemIcon>
			<TransactionIcon />
		      </ListItemIcon>
		      <ListItemText className={classes.text} primary="Transactions" />
		      <ListItemSecondaryAction>
			<Switch
			    edge="end"
			    checked={data.ibisUser.notifier.emailTransaction}
			    onChange={() => (this.updateSetting(
				notifier_mutation,
				refetch,
				'emailTransaction',
				!data.ibisUser.notifier.emailTransaction,
			    ))}
			/>
		      </ListItemSecondaryAction>
		    </ListItem>
		):(
		    <ListItem>
		      <ListItemIcon>
			<DonationIcon />
		      </ListItemIcon>
		      <ListItemText className={classes.text} primary="Donations" />
		      <ListItemSecondaryAction>
			<Switch
			    edge="end"
			    checked={data.ibisUser.notifier.emailDonation}
			    onChange={() => (this.updateSetting(
				notifier_mutation,
				refetch,
				'emailDonation',
				!data.ibisUser.notifier.emailDonation,
			    ))}
			/>
		      </ListItemSecondaryAction>
		    </ListItem>
		)}
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <CommentIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Comments" />
		  <ListItemSecondaryAction>
		    <Switch
			edge="end"
			checked={data.ibisUser.notifier.emailComment}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailComment',
			    !data.ibisUser.notifier.emailComment,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <DepositIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Deposits" />
		  <ListItemSecondaryAction>
		    <Switch
			edge="end"
			checked={data.ibisUser.notifier.emailDeposit}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailDeposit',
			    !data.ibisUser.notifier.emailDeposit,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
	      </List>
	    </div>
	);
    };

    render() {

	let { classes, context } = this.props;

	return (
	    <Query
	      fetchPolicy="no-cache"
	      query={query}
	      variables={{ id: context.userID }}
	    >
	      {({ loading, error, data, refetch }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return (
		      <Mutation
			  mutation={
			  context.userType === 'person' ?
			  person_mutation :
			  nonprofit_mutation
			  }
			  variables={{ id: context.userID}}>
			{user_mutation => (
			    <Mutation
				mutation={notifier_mutation}
				variables={{ id: data.ibisUser.notifier.id}}
				>
			      {notifier_mutation => (
				  this.inner(data, refetch, user_mutation, notifier_mutation)
			      )}
			    </Mutation>
			)}
		      </Mutation>
		  );
	      }}
	    </Query>
	);
    };
};

export default withStyles(styles)(Settings);

