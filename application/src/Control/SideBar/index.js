import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';
import GiveIcon from '@material-ui/icons/CardGiftcard';
import SendIcon from '@material-ui/icons/SendOutlined';
import ConnectIcon from '@material-ui/icons/DeviceHub';
import NonprofitIcon from '@material-ui/icons/StoreOutlined';
import DonationIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/AccountCircleOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import HelpIcon from '@material-ui/icons/HelpOutline';

import Sublist from '../__Common__/Sublist';
import SublistItem from '../__Common__/SublistItem';
import { BlankVal, GiveVal, SendVal, ConnectVal } from '../Cycler';
import Give, { NonprofitVal, DonationVal } from '../Give';
import Send, { PersonVal, TransactionVal } from '../Send';
import Connect, { NewsVal, EventVal } from '../Connect';
import Account from '../../Pages/Account';
import Settings from '../../Pages/Settings';
import QRScan from '../../Pages/QRScan';
import Help from '../../Pages/Help';
import QRIcon from '../../__Common__/QRIcon';

const styles = theme => ({
    avatar: {
	margin: 10,
	width: 80,
	height: 80,
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    sideBar: {
	minWidth: theme.spacing.unit * 28,
    },
    nested: {
	paddingLeft: theme.spacing.unit * 4,
    },
    link: {
	color: theme.palette.secondary.main,
    },
});

class SideBar extends Component {

    state = {
	drawer: false,
	expanded: null,
    };

    toggleDrawer = (drawer) => {
	this.setState({ drawer, expanded: null });
    };

    handleOpen = (event) => {
	this.setState({ anchorEl: event.currentTarget });
    };

    handleClick = (page, switchVal) => {
	let { handlePage } = this.props

	this.setState({ 
	    drawer: false,
	    expanded: null,
	});

	handlePage(page, switchVal);
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: false }) :
	this.setState({ expanded });
    };

    render() {
	let { classes } = this.props;
	let { drawer, expanded } =this.state;

	let sideBar = (
	    <div className={classes.sideBar}>
  	      <Grid container direction="column" justify="center" alignItems="center">
		<Avatar
		    onClick={(e) => this.handleClick(<Account />, BlankVal)}
		    alt="Ibis"
		    src={require('../../Static/Images/nonprofit.jpg')}
		    className={classes.avatar}
		/>
	      </Grid>
	      <Divider />
	      <Sublist
		  label="Give"
		  value={expanded === 'Give'}
		  icon={<GiveIcon />}
		  onClick={(e) => {this.handleExpand('Give')}}
	      >
		<SublistItem
		label="Nonprofits"
		classes={classes}
		icon={<NonprofitIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Give value={NonprofitVal} />, GiveVal)}
		/>
		<SublistItem
		label="Donations"
		classes={classes}
		icon={<DonationIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Give value={DonationVal} />, GiveVal)}
		/>
	      </Sublist>
	      <Sublist
		  label="Send"
		  value={expanded === 'Send'}
		  icon={<SendIcon />}
		  onClick={(e) => {this.handleExpand('Send')}}
	      >
		<SublistItem
		label="People"
		classes={classes}
		icon={<PersonIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Send value={PersonVal} />, SendVal)}
		/>
		<SublistItem
		label="Transactions"
		classes={classes}
		icon={<TransactionIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Send value={TransactionVal} />, SendVal)}
		/>
	      </Sublist>
	      <Sublist
		  label="Connect"
		  value={expanded === 'Connect'}
		  icon={<ConnectIcon />}
		  onClick={(e) => {this.handleExpand('Connect')}}
	      >
		<SublistItem
		label="News"
		classes={classes}
		icon={<NewsIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Connect value={NewsVal} />, ConnectVal)}
		/>
		<SublistItem
		label="Events"
		classes={classes}
		icon={<EventIcon className={classes.link} />}
		onClick={(e) => this.handleClick(<Connect value={EventVal} />, ConnectVal)}
		/>
	      </Sublist>
	      <SublistItem
		  label="Settings"
		  classes={classes}
		  icon={<SettingsIcon className={classes.link} />}
		  onClick={(e) => this.handleClick(<Settings />, BlankVal)}
	      />
	      <SublistItem
		  label="Help"
		  classes={classes}
		  icon={<HelpIcon className={classes.link} />}
		  onClick={(e) => this.handleClick(<Help />, BlankVal)}
	      />
	      <SublistItem
		  label="Scanner"
		  classes={classes}
		  icon={<QRIcon className={classes.link} />}
		  onClick={(e) => this.handleClick(<QRScan />, BlankVal)}
	      />
	    </div>
	);

	return (
	    <div>
	      <IconButton 
		  color="inherit" 
		  onClick={(e) => this.toggleDrawer(true)} >
		<MenuIcon /> 
	      </IconButton>
	      <SwipeableDrawer
		  open={drawer}
		  onClose={(e) => this.toggleDrawer(false)}
		  onOpen={(e) => this.toggleDrawer(true)}
              >
		{sideBar}
              </SwipeableDrawer>
	    </div>
	);
    };
};

SideBar.propTypes = {
    handlePage: PropTypes.func.isRequired,
};

export default withStyles(styles)(SideBar);
