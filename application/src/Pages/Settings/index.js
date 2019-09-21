import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
    },
    text: {
	color: theme.palette.primary.main,
    },
});

class Settings extends Component {

    state = {
	settings: {
	    transaction: 0,
	    follow: 0,
	    pushTransaction: true,
	    pushFollow: true,
	    pushLike: true,
	    emailTransaction: true,
	    emailFollow: false,
	    emailLike: false,
	},
    };

    handleInput = (key, value) => () => {
	let { settings } = this.state;
	settings[key] = value;
	this.setState(settings);
    };

    render() {

	let { settings } = this.state;
	let { classes } = this.props;
	
	return (
	    <div>
	      <List
		  subheader={<ListSubheader color="primary">Following Privacy</ListSubheader>}
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
			onChange={this.handleInput('follow', 0)}
			checked={settings.follow === 0}
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
			onChange={this.handleInput('follow', 1)}
			checked={settings.follow === 1}
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
			onChange={this.handleInput('follow', 2)}
			checked={settings.follow === 2}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={<ListSubheader color="primary">Transaction Privacy</ListSubheader>}
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
			onChange={this.handleInput('transaction', 0)}
			checked={settings.transaction === 0}
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
			onChange={this.handleInput('transaction', 1)}
			checked={settings.transaction === 1}
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
			onChange={this.handleInput('transaction', 2)}
			checked={settings.transaction === 2}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={<ListSubheader color="primary">Push Notifications</ListSubheader>}
		  className={classes.root}
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <TransactionIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Transactions" />
		  <ListItemSecondaryAction>
		    <Switch
		    edge="end"
		    onChange={this.handleInput('pushTransaction', !settings.pushTransaction)}
		    checked={settings.pushTransaction}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <FollowIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Follows" />
		  <ListItemSecondaryAction>
		    <Switch
		    edge="end"
		    onChange={this.handleInput('pushFollow', !settings.pushFollow)}
		    checked={settings.pushFollow}
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
		    onChange={this.handleInput('pushLike', !settings.pushLike)}
		    checked={settings.pushLike}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	      <List
		  subheader={<ListSubheader color="primary">Email Notifications</ListSubheader>}
		  className={classes.root}
	      >
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <TransactionIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Transactions" />
		  <ListItemSecondaryAction>
		    <Switch
		    edge="end"
		    onChange={this.handleInput('emailTransaction', !settings.emailTransaction)}
		    checked={settings.emailTransaction}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
		<ListItem>
		  <ListItemIcon>
		    <FollowIcon />
		  </ListItemIcon>
		  <ListItemText className={classes.text} primary="Follows" />
		  <ListItemSecondaryAction>
		    <Switch
		    edge="end"
		    onChange={this.handleInput('emailFollow', !settings.emailFollow)}
		    checked={settings.emailFollow}
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
		    onChange={this.handleInput('emailLike', !settings.emailLike)}
		    checked={settings.emailLike}
		    />
		  </ListItemSecondaryAction>
		</ListItem>
		<CustomDivider />
	      </List>
	    </div>
	);
    };
};

export default withStyles(styles)(Settings);
