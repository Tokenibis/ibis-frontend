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
import PublicIcon from '@material-ui/icons/Public';
import FollowingIcon from '@material-ui/icons/People';
import MeIcon from '@material-ui/icons/PersonOutlined';
import EditIcon from '@material-ui/icons/Edit';
import SubmitIcon from '@material-ui/icons/DoneOutline';
import Radio from '@material-ui/core/Radio';

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
    usernameEdit: {
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

const notifier_mutation = loader('../../Static/graphql/operations/NotifierSettingsUpdate.gql')

class Settings extends Component {

    state = {
	dialog: '',
	username: null,
	editUsername: false,
	canSubmitUsername: false,
    };

    updateUsername = (mutation, refetch) => {
	let username = document.getElementById('edit_username').value;
	mutation({ variables: { username } }).then(response => {
	    refetch();
	    this.setState({ editUsername: false });
	}).catch(error => {
	    if (error.toString().includes('UNIQUE constraint failed')) {
		this.setState({ dialog: `Sorry, that username is already taken. Please pick another one, or consider sending a bribe to __@${username}__ for naming rights (ibis tokens only, of course...)` })
	    } else {
		alert('Hm... something went wrong, please try again or contact __info@tokenibis.org__ to report this bug')
	    }
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

    handleInput(current) {
	let username = document.getElementById('edit_username').value.toString()
	username = username.replace(/[^a-z0-9_]/g, '').slice(0, MAX_USERNAME_LEN)

	let canSubmitUsername = username !== current && username.length >= MIN_USERNAME_LEN;
	this.setState({ username, canSubmitUsername });
    }

    handleChangeUsername(event, current) {

	let value = document.getElementById('edit_username').value;
	
	let canSubmitUsername = value !== current &&
				value.length >= MIN_USERNAME_LEN &&
				value.length <= MAX_USERNAME_LEN;
	this.setState({ canSubmitUsername });
	    
    }

    inner(data, refetch, person_mutation, notifier_mutation) {

	let { classes } = this.props;
	let { dialog, username, editUsername, canSubmitUsername } = this.state;

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
			Personal Info
		      </ListSubheader>
		  }
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <UsernameIcon />
		  </ListItemIcon>
		  {editUsername ? (
		      <div>
		      <ListItemText className={classes.usernameEdit} primary={
			  <TextField
			      id="edit_username"
				  autoFocus
				  required
				  className={classes.textField}
				  margin="normal"
				  variant="outlined"
				  fullWidth
				  value={username !== null ? username: data.person.username}
			          onInput={() => this.handleInput(data.person.username)}
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
		      <ListItemText className={classes.text} primary={`@${data.person.username}`} />
		  )}
		  <ListItemSecondaryAction>
		    {editUsername ? (
			<IconButton
			    className={canSubmitUsername ? classes.button : classes.disabledButton}
			    onClick={() => {this.updateUsername(person_mutation, refetch)}}
			    >
			  <SubmitIcon />
			</IconButton>
		    ):(
			<IconButton
			  onClick={() => {this.setState({ editUsername: true })}}
			>
			  <EditIcon color="secondary" />
			</IconButton>
		    )}
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={
		      <ListSubheader disableSticky className={classes.subheader}>
			Donation Visibility
		      </ListSubheader>
		  }
		  className={classes.root}
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <PublicIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Public" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityDonation === 'PC'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityDonation',
			    'PC',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <FollowingIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Following Only" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityDonation === 'FL'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityDonation',
			    'FL',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <MeIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Me Only" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityDonation === 'PR'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityDonation',
			    'PR',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={
		      <ListSubheader disableSticky className={classes.subheader}>
			Transaction Visibility
		      </ListSubheader>
		  }
		  className={classes.root}
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <PublicIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Public" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityTransaction === 'PC'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityTransaction',
			    'PC',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <FollowingIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Following Only" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityTransaction === 'FL'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityTransaction',
			    'FL',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <MeIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Me Only" />
		  <ListItemSecondaryAction>
		    <Radio
			checked={data.person.visibilityTransaction === 'PR'}
			onChange={() => (this.updateSetting(
			    person_mutation,
			    refetch,
			    'visibilityTransaction',
			    'PR',
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
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
		      <Mutation mutation={person_mutation} variables={{ id: context.userID}}>
			{person_mutation => (
			    <Mutation
				mutation={notifier_mutation}
				variables={{ id: data.person.notifier.id}}
				>
			      {notifier_mutation => (
				  this.inner(data, refetch, person_mutation, notifier_mutation)
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

/* <List
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
   checked={data.person.notifier.emailFollow}
   onChange={() => (this.updateSetting(
   notifier_mutation,
   refetch,
   'emailFollow',
   !data.person.notifier.emailFollow,
   ))}
   />
   </ListItemSecondaryAction>
   </ListItem>
   <CustomDivider />
   <ListItem>
   <ListItemIcon>
   <TransactionIcon />
   </ListItemIcon>
   <ListItemText className={classes.text} primary="Transactions" />
   <ListItemSecondaryAction>
   <Switch
   edge="end"
   checked={data.person.notifier.emailTransaction}
   onChange={() => (this.updateSetting(
   notifier_mutation,
   refetch,
   'emailTransaction',
   !data.person.notifier.emailTransaction,
   ))}
   />
   </ListItemSecondaryAction>
   </ListItem>
   <CustomDivider />
   <ListItem>
   <ListItemIcon>
   <TransactionIcon />
   </ListItemIcon>
   <ListItemText className={classes.text} primary="Comments" />
   <ListItemSecondaryAction>
   <Switch
   edge="end"
   checked={data.person.notifier.emailComment}
   onChange={() => (this.updateSetting(
   notifier_mutation,
   refetch,
   'emailComment',
   !data.person.notifier.emailComment,
   ))}
   />
   </ListItemSecondaryAction>
   </ListItem>
   <CustomDivider />
   <ListItem>
   <ListItemIcon>
   <LikeIcon />
   </ListItemIcon>
   <ListItemText className={classes.text} primary="Likes" />
   <ListItemSecondaryAction>
   <Switch
   edge="end"
   checked={data.person.notifier.emailLike}
   onChange={() => (this.updateSetting(
   notifier_mutation,
   refetch,
   'emailLike',
   !data.person.notifier.emailLike,
   ))}
   />
   </ListItemSecondaryAction>
   </ListItem>
   <CustomDivider />
   </List> */
