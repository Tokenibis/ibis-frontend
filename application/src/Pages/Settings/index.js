import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from "react-apollo";
import { loader } from 'graphql.macro';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import PublicIcon from '@material-ui/icons/Public';
import FollowingIcon from '@material-ui/icons/People';
import MeIcon from '@material-ui/icons/PersonOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import FollowIcon from '@material-ui/icons/Add';
import LikeIcon from '@material-ui/icons/Favorite';

import Radio from '@material-ui/core/Radio';
import CustomDivider from '../../__Common__/CustomDivider';


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
});

const query = loader('../../Static/graphql/operations/Settings.gql')

const person_mutation = loader('../../Static/graphql/operations/PersonSettingsUpdate.gql')

const notifier_mutation = loader('../../Static/graphql/operations/NotifierSettingsUpdate.gql')

class Settings extends Component {

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

    inner(data, refetch, person_mutation, notifier_mutation) {

	let { classes } = this.props;

	return (
	    <div>
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
			    <Mutation mutation={notifier_mutation} variables={{ id: data.person.notifier.id}}>
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
