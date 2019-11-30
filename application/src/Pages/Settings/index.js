import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
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

const SETTINGS = {
    notifyEmailFollow: 'Boolean',
    notifyEmailTransaction: 'Boolean',
    notifyEmailComment: 'Boolean',
    notifyEmailLike: 'Boolean',
    visibilityFollow: 'String',
    visibilityDonation: 'String',
    visibilityTransaction: 'String',
}

const QUERY = gql`
    query Settings($id: ID!) {
	person(id: $id) {
	    ${Object.keys(SETTINGS).join('\n')}
	}
    }
`;

const MUTATION = gql`
    mutation UpdateSettings($id: ID! ${Object.keys(SETTINGS).map(k => '$' + k + ': ' + SETTINGS[k]).join(' ')}) {
	updatePerson(id: $id ${Object.keys(SETTINGS).map(k => k + ': $' + k).join(' ')}) {
	    person {
		id
		notifyEmailFollow
	    }
	}
    }
`;

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

    inner(data, refetch, mutation) {

	let { classes, context } = this.props;

	return (
	    <div>
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
			checked={data.person.notifyEmailFollow}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'notifyEmailFollow',
			    !data.person.notifyEmailFollow,
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
			checked={data.person.notifyEmailTransaction}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'notifyEmailTransaction',
			    !data.person.notifyEmailTransaction,
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
			checked={data.person.notifyEmailComment}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'notifyEmailComment',
			    !data.person.notifyEmailComment,
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
			checked={data.person.notifyEmailLike}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'notifyEmailLike',
			    !data.person.notifyEmailLike,
			))}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={
		      <ListSubheader disableSticky className={classes.subheader}>
			Following Visibility
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
			checked={data.person.visibilityFollow === 'PC'}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'visibilityFollow',
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
			checked={data.person.visibilityFollow === 'FL'}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'visibilityFollow',
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
			checked={data.person.visibilityFollow === 'PR'}
			onChange={() => (this.updateSetting(
			    mutation,
			    refetch,
			    'visibilityFollow',
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
			    mutation,
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
			    mutation,
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
			    mutation,
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
			    mutation,
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
			    mutation,
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
			    mutation,
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
	      query={QUERY}
	      variables={{ id: context.userID }}
	    >
	      {({ loading, error, data, refetch }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return (
		      <Mutation mutation={MUTATION} variables={{ id: context.userID}}>
			{mutation => (
			   this.inner(data, refetch, mutation)
			)}
		      </Mutation>
		  );
	      }}
	    </Query>
	);
    };
};

export default withStyles(styles)(Settings);
