import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from "react-apollo";
import { loader } from 'graphql.macro';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
import DescriptionIcon from '@material-ui/icons/Subject';
import UsernameIcon from '@material-ui/icons/FontDownloadOutlined';
import NameIcon from '@material-ui/icons/FontDownloadOutlined';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PasswordIcon from '@material-ui/icons/LockOutlined';
import FollowIcon from '@material-ui/icons/HowToReg';
import DonationIcon from '@material-ui/icons/MonetizationOnOutlined';
import RewardIcon from '@material-ui/icons/SwapHoriz';
import CommentIcon from '@material-ui/icons/Comment';
import MentionIcon from '@material-ui/icons/RecordVoiceOver';
import DepositIcon from '@material-ui/icons/LocalAtm';
import AvatarIcon from '@material-ui/icons/Portrait';
import BannerIcon from '@material-ui/icons/Wallpaper';
import SubmitIcon from '@material-ui/icons/DoneOutline';
import Switch from '@material-ui/core/Switch';
import axios from "axios";

import CustomDivider from '../../__Common__/CustomDivider';
import CustomMarkdown from '../../__Common__/CustomMarkdown';
import Confirmation from '../../__Common__/Confirmation';

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
	marginTop: theme.spacing(-1),
	paddingLeft: theme.spacing(10),
	paddingBottom: theme.spacing(),
    },
    dialogInner: {
	padding: theme.spacing(2),
	textAlign: 'center',
    },
    descriptionSubmitWrapper: {
	textAlign: 'right',
    },
    progressWrapper: {
	textAlign: 'center',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	paddingRight: theme.spacing(2),
    },
    button: {
	zIndex: 10,
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(2),
    },
    disabledButton: {
	zIndex: 10,
	color: theme.palette.secondary,
	pointerEvents: 'none',
	opacity: '50%',
	paddingRight: theme.spacing(2),
    },
    edit: {
	paddingLeft: theme.spacing(9),
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
    },
    descriptionEdit: {
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(2),
    },
    fileWrapper: {
	overflow: 'hidden',
    },
    file: {
	paddingLeft: theme.spacing(9),
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

const query = loader('../../Static/graphql/app/Settings.gql')

const user_mutations = {
    'Person': loader('../../Static/graphql/app/PersonUpdate.gql'),
    'Organization': loader('../../Static/graphql/app/OrganizationUpdate.gql'),
    'Bot': loader('../../Static/graphql/app/BotUpdate.gql'),
}

const notifier_mutation = loader('../../Static/graphql/app/NotifierUpdate.gql')

class Settings extends Component {

    state = {
	dialog: '',
	username: null,
	description: null,
	name: null,
	email: null,
	editField: '',
	canSubmit: false,
	loading: false,
    };

    updateUsername = (mutation, refetch) => {
	let username = document.getElementById('edit_username').value;
	mutation({ variables: { username } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    if (error.toString().includes('UNIQUE constraint failed')) {
		this.setState({ dialog: `Sorry, that username is already taken. Please pick another one, or consider sending a bribe to __@${username}__ for naming rights (ibis tokens only, of course...)` })
	    } else {
		alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	    }
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
    }

    updateAvatar = (mutation, refetch) => {
	let avatar = document.getElementById('upload_avatar').files[0];
	mutation({ variables: { avatar } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    alert('Oops, something went wrong');
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
    }

    updateDescription = (mutation, refetch) => {
	let description = document.getElementById('edit_description').value;
	mutation({ variables: { description } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    alert('Oops, something went wrong');
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
    }

    updateName = (mutation, refetch) => {
	let name = document.getElementById('edit_name').value;
	mutation({ variables: { firstName: name } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
    }

    updateEmail = (mutation, refetch) => {
	let email = document.getElementById('edit_email').value;
	console.log(email)
	mutation({ variables: { email } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
    }


    updateBanner = (mutation, refetch) => {
	let banner = document.getElementById('upload_banner').files[0];
	mutation({ variables: { banner } }).then(response => {
	    refetch();
	    this.setState({ editField: '', loading: false, dialog: 'Success!' });
	}).catch(error => {
	    alert('Oops, something went wrong');
	    this.setState({ loading: false });
	});
	this.setState({ loading: true });
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
	username = username.replace(/\W/g, '').slice(0, MAX_USERNAME_LEN).toLowerCase();

	let canSubmit = username !== current && username.length >= MIN_USERNAME_LEN;
	this.setState({ username, canSubmit });
    }

    handleAvatarInput = (e) => {
	if (document.getElementById('upload_avatar').files.length > 1) {
	    alert('You can only upload one profile avatar');
	    document.getElementById('upload_avatar').value = null;
	}
	this.setState({ canSubmit: document.getElementById('upload_avatar').files.length === 1 });
    }

    handleDescriptionInput(current) {
	let description = document.getElementById('edit_description').value.toString()

	let canSubmit = description !== current;
	this.setState({ description, canSubmit });
    }

    handleNameInput(current) {
	let name = document.getElementById('edit_name').value.toString()
	let canSubmit = name && name !== current
	this.setState({ name, canSubmit });
    }

    handleEmailInput(current) {
	let email = document.getElementById('edit_email').value.toString()
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let canSubmit = email !== current && re.test(email.toLowerCase());
	this.setState({ email, canSubmit });
    }

    handleBannerInput = (e) => {
	if (document.getElementById('upload_banner').files.length > 1) {
	    alert('You can only upload one profile banner');
	    document.getElementById('upload_banner').value = null;
	}
	this.setState({ canSubmit: document.getElementById('upload_banner').files.length === 1 });
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
	    description,
	    name,
	    email,
	    editField,
	    canSubmit,
	    loading,
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
			Profile
		      </ListSubheader>
		  }
	      >
		<CustomDivider />
		<ListItem
		    button
		    onClick={(e) => {
			this.setState({ editField: editField !== 'username' ? 'username': '' })
		    }}
		>
		  <ListItemIcon>
		    <UsernameIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Change Username" />
		  {editField === 'username' ? 
		   <ExpandLess color="secondary"/> :
		   <ExpandMore color="secondary"/>}
		</ListItem>
		<Collapse in={editField === 'username'} timeout="auto" unmountOnExit>
		  <div className={classes.action}>
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
			  value={username !== null ? username: data.user.username}
			  onInput={() => this.handleUsernameInput(data.user.username)}
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
		    {loading ? (
			<span className={classes.progressWrapper}>
			  <CircularProgress size={24} className={classes.progress}/>
			</span>
		    ):(
			<IconButton
			  className={canSubmit ? classes.button : classes.disabledButton}
			  onClick={() => {this.updateUsername(user_mutation, refetch)}}
			    >
			  <SubmitIcon />
			</IconButton>
		    )}
		  </div>
		</Collapse>
		<CustomDivider />
		<ListItem
		    button
		    onClick={(e) => {
			this.setState({ editField: editField !== 'description' ? 'description': '' })
		    }}
		>
		  <ListItemIcon>
		    <DescriptionIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Change Bio" />
		  {editField === 'description' ? 
		   <ExpandLess color="secondary"/> :
		   <ExpandMore color="secondary"/>}
		</ListItem>
		<Collapse in={editField === 'description'} timeout="auto" unmountOnExit>
		  <ListItemText className={classes.descriptionEdit} primary={
		      <TextField
		      id="edit_description"
		      autoFocus
		      required
		      value={description !== null ? description: data.user.description}
 		      className={classes.textField}
		      margin="normal"
		      variant="outlined"
		      fullWidth
		      multiline
		      onInput={() => this.handleDescriptionInput(data.user.description)}
		      />
		  }/>
		  <div className={classes.descriptionSubmitWrapper}>
		    <Confirmation
			onClick={() => this.updateDescription(user_mutation, refetch)}
			message="Are you sure you want to change your bio to the following?"
			preview={() => (description !== null ? description: data.user.description)}
		    >
		      {loading ? (
			  <span className={classes.progressWrapper}>
			    <CircularProgress size={24} className={classes.progress}/>
			  </span>
		      ):(
			  <IconButton
			      className={canSubmit ? classes.button : classes.disabledButton}
			      >
			    <SubmitIcon />
			  </IconButton>
		      )}
		    </Confirmation>
		  </div>
		</Collapse>
		<CustomDivider />
		<ListItem
		    button
		    onClick={(e) => {
			this.setState({ editField: editField !== 'avatar' ? 'avatar': '' })
		    }}
		>
		  <ListItemIcon>
		    <AvatarIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Change Avatar" />
		  {editField === 'avatar' ? 
		   <ExpandLess color="secondary"/> :
		   <ExpandMore color="secondary"/>}
		</ListItem>
		<Collapse in={editField === 'avatar'} timeout="auto" unmountOnExit>
		  <div className={classes.action}>
		    <div className={classes.fileWrapper}>
		      <input
			  accept="image/*"
			  className={classes.file}
			  id="upload_avatar"
			  multiple
			  type="file"
		          onChange={(e) => this.handleAvatarInput(e)}
		      />
		    </div>
		    {loading ? (
			<span className={classes.progressWrapper}>
			  <CircularProgress size={24} className={classes.progress}/>
			</span>
		    ):(
			<IconButton
			  className={canSubmit ? classes.button : classes.disabledButton}
			  onClick={() => {this.updateAvatar(user_mutation, refetch)}}
			    >
			  <SubmitIcon />
			</IconButton>
		    )}
		  </div>
		</Collapse>
		{context.userType === 'Organization' &&
		 <div>
		   <CustomDivider />
		   <ListItem
		       button
		       onClick={(e) => {
			   this.setState({ editField: editField !== 'name' ? 'name': '' })
		       }}
		     >
		     <ListItemIcon>
		       <NameIcon />
		     </ListItemIcon>
		     <ListItemText className={classes.text} primary="Change Name" />
		     {editField === 'name' ? 
		      <ExpandLess color="secondary"/> :
		      <ExpandMore color="secondary"/>}
		   </ListItem>
		   <Collapse in={editField === 'name'} timeout="auto" unmountOnExit>
		     <div className={classes.action}>
		       <div>
			 <ListItemText className={classes.edit} primary={
			     <TextField
				 id="edit_name"
				     autoFocus
				     required
				     className={classes.textField}
				     margin="normal"
				     variant="outlined"
				     fullWidth
				     value={name !== null ? name: data.user.firstName}
			             onInput={() => this.handleNameInput(data.user.firstName)}
			     />
			 }/>
			 <Typography variant="body2" className={classes.fine}>
			   This change will take effect on your next notification
			 </Typography>
		       </div>
		       {loading ? (
			   <span className={classes.progressWrapper}>
			     <CircularProgress size={24} className={classes.progress}/>
			   </span>
		       ):(
			   <IconButton
			       className={canSubmit ? classes.button : classes.disabledButton}
			       onClick={() => {this.updateName(user_mutation, refetch)}}
			       >
			     <SubmitIcon />
			   </IconButton>
		       )}
		     </div>
		   </Collapse>
		   <CustomDivider />
		   <ListItem
		       button
		       onClick={(e) => {
			   this.setState({ editField: editField !== 'email' ? 'email': '' })
		       }}
		     >
		     <ListItemIcon>
		       <EmailIcon />
		     </ListItemIcon>
		     <ListItemText className={classes.text} primary="Change Email" />
		     {editField === 'email' ? 
		      <ExpandLess color="secondary"/> :
		      <ExpandMore color="secondary"/>}
		   </ListItem>
		   <Collapse in={editField === 'email'} timeout="auto" unmountOnExit>
		     <div className={classes.action}>
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
				     value={email !== null ? email: data.user.email}
			             onInput={() => this.handleEmailInput(data.user.email)}
			     />
			 }/>
			 <Typography variant="body2" className={classes.fine}>
			   This change will take effect on your next notification
			 </Typography>
		       </div>
		       {loading ? (
			   <span className={classes.progressWrapper}>
			     <CircularProgress size={24} className={classes.progress}/>
			   </span>
		       ):(
			   <IconButton
			       className={canSubmit ? classes.button : classes.disabledButton}
			       onClick={() => {this.updateEmail(user_mutation, refetch)}}
			       >
			     <SubmitIcon />
			   </IconButton>
		       )}
		     </div>
		   </Collapse>
		   <CustomDivider />
		   <ListItem
		       button
		       onClick={(e) => {
			   this.setState({ editField: editField !== 'password' ? 'password': '' })
		       }}
		     >
		     <ListItemIcon>
		       <PasswordIcon />
		     </ListItemIcon>
		     <ListItemText className={classes.text} primary="Change Password" />
		     {editField === 'password' ? 
		      <ExpandLess color="secondary"/> :
		      <ExpandMore color="secondary"/>}
		   </ListItem>
		   <Collapse in={editField === 'password'} timeout="auto" unmountOnExit>
		     <div className={classes.action}>
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
			             onInput={() => this.handlePasswordInput(data.user.password)}
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
			             onInput={() => this.handlePasswordInput(data.user.password)}
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
			             onInput={() => this.handlePasswordInput(data.user.password)}
			     />
			 }/>
		       </div>
		       {loading ? (
			   <span className={classes.progressWrapper}>
			     <CircularProgress size={24} className={classes.progress}/>
			   </span>
		       ):(
			   <IconButton
			       className={canSubmit ? classes.button : classes.disabledButton}
			       onClick={() => {this.updatePassword(user_mutation, refetch)}}
			       >
			     <SubmitIcon />
			   </IconButton>
		       )}
		     </div>
		   </Collapse>
		   <CustomDivider />
		   <ListItem
		       button
		       onClick={(e) => {
			   this.setState({ editField: editField !== 'banner' ? 'banner': '' })
		       }}
		     >
		     <ListItemIcon>
		       <BannerIcon />
		     </ListItemIcon>
		     <ListItemText className={classes.text} primary="Change Banner" />
		     {editField === 'banner' ? 
		      <ExpandLess color="secondary"/> :
		      <ExpandMore color="secondary"/>}
		   </ListItem>
		   <Collapse in={editField === 'banner'} timeout="auto" unmountOnExit>
		     <div className={classes.action}>
		       <div className={classes.fileWrapper}>
			 <input
			     accept="image/*"
			     className={classes.file}
			     id="upload_banner"
			     multiple
			     type="file"
		             onChange={(e) => this.handleBannerInput(e)}
			 />
		       </div>
		       {loading ? (
			   <span className={classes.progressWrapper}>
			     <CircularProgress size={24} className={classes.progress}/>
			   </span>
		       ):(
			   <IconButton
			       className={canSubmit ? classes.button : classes.disabledButton}
			       onClick={() => {this.updateBanner(user_mutation, refetch)}}
			       >
			     <SubmitIcon />
			   </IconButton>
		       )}
		     </div>
		   </Collapse>
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
			checked={data.user.notifier.emailFollow}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailFollow',
			    !data.user.notifier.emailFollow,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		{context.userType === 'Person' ? (
		    <ListItem>
		      <ListItemIcon>
			<RewardIcon />
		      </ListItemIcon>
		      <ListItemText className={classes.text} primary="Rewards" />
		      <ListItemSecondaryAction>
			<Switch
			    edge="end"
			    checked={data.user.notifier.emailReward}
			    onChange={() => (this.updateSetting(
				notifier_mutation,
				refetch,
				'emailReward',
				!data.user.notifier.emailReward,
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
			    checked={data.user.notifier.emailDonation}
			    onChange={() => (this.updateSetting(
				notifier_mutation,
				refetch,
				'emailDonation',
				!data.user.notifier.emailDonation,
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
			checked={data.user.notifier.emailComment}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailComment',
			    !data.user.notifier.emailComment,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <MentionIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Mentions" />
		  <ListItemSecondaryAction>
		    <Switch
			edge="end"
			checked={data.user.notifier.emailMention}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailMention',
			    !data.user.notifier.emailMention,
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
			checked={data.user.notifier.emailDeposit}
			onChange={() => (this.updateSetting(
			    notifier_mutation,
			    refetch,
			    'emailDeposit',
			    !data.user.notifier.emailDeposit,
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
			  mutation={user_mutations[context.userType]}
			  variables={{ id: context.userID}}>
			{user_mutation => (
			    <Mutation
				mutation={notifier_mutation}
				variables={{ id: data.user.notifier.id}}
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
