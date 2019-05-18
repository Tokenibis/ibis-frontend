import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import NotificationIcon from '@material-ui/icons/NotificationsOutlined';
import GiveIcon from '@material-ui/icons/CardGiftcard';
import SendIcon from '@material-ui/icons/SendOutlined';
import ConnectIcon from '@material-ui/icons/DeviceHub';
import NonprofitIcon from '@material-ui/icons/StoreOutlined';
import DonationIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/AccountCircleOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/CalendarToday';

import { BlankVal, GiveVal, SendVal, ConnectVal } from '../Cycler';
import Account from '../../Pages/Account';
import Notifications from '../../Pages/Notifications';
import Give, { NonprofitVal, DonationVal } from '../Give';
import Send, { PersonVal, TransactionVal } from '../Send';
import Connect, { NewsVal, EventVal } from '../Connect';
import Quote from './Quote'

const styles = theme => ({
    list: {
	width: '70%',
	maxWidth: 360,
    },
    balance: {
	color: theme.palette.primary.main,
    },
    notifications: {
	color: theme.palette.secondary.main,
	paddingBottom: theme.spacing.unit * 4,
    },
    notificationIcon: {
	color: theme.palette.secondary.main,
	fontSize: 14,
	marginBottom: -2,
    },
    link: {
	color: theme.palette.secondary.main,
    },
    nested: {
	paddingLeft: theme.spacing.unit * 4,
    },
    avatar: {
	marginTop: - theme.spacing.unit * 3,
	width: 100,
	height: 100,
    },
    quote: {
	paddingTop: theme.spacing.unit * 4,
	width: '70%',
	maxWidth: 360,
    }
});

function SubListItem({ classes, label, icon, onClick }) {
    return (
	<div>
	  <List component="div" disablePadding>
	    <ListItem
	      button
	      className={classes.nested}
	      onClick={onClick}
	    >
	      <ListItemIcon>
		{icon}
	      </ListItemIcon>
	      <ListItemText
		  disableTypography
		  primary={
		      <Typography type="body2" className={classes.link}>
			{label}
		      </Typography>
		  }
	      />
	    </ListItem>
	  </List>
	</div>
    );
};

function SubList({label, value, icon, children, onClick}) {
    return (
	<div>
	  <ListItem button onClick={onClick}>
	    <ListItemIcon>
	      {icon}
	    </ListItemIcon>
	    <ListItemText primary={label} />
	    {value ?
	     <ExpandLess color="secondary"/> :
	     <ExpandMore color="secondary"/>}
	  </ListItem>
	  <Collapse in={value} timeout="auto" unmountOnExit>
	    {children}
	  </Collapse>
	  <Divider />
	</div>
    );
};

class Home extends Component {
    state = {
	open: null,
    };

    handleClick(open) {
	this.state.open === open ?
	this.setState({ open: false }) :
	this.setState({ open });
    };

    render() {
	let { classes, handlePage } = this.props;
	let { open } = this.state;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
  	      <Avatar onClick={(e) => handlePage(<Account />, BlankVal)}
  		      alt="Ibis"
  		      src={require('../../Static/Images/nonprofit.jpg')}
  		      className={classes.avatar} />
	      <Typography variant="h6" className={classes.balance}>
  		Balance ${0}
	      </Typography>
	      <Typography variant="body2" className={classes.notifications}>
		<div onClick={(e) => handlePage(<Notifications />)} >
		  Notifications ({<NotificationIcon className={classes.notificationIcon} />})
		</div>
	      </Typography>
	      <List
		component="nav"
		className={classes.list}
	      >
		<Divider />
		<SubList label="Give"
			 value={open === 'openGive'}
			 icon={<GiveIcon />}
			 onClick={(e) => {this.handleClick('openGive')}}
		>
		  <SubListItem
		      label="Nonprofits"
		      classes={classes}
		      icon={<NonprofitIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Give value={NonprofitVal} />, GiveVal)}
		  />
		  <SubListItem
		      label="Donations"
		      classes={classes}
		      icon={<DonationIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Give value={DonationVal} />, GiveVal)}
		  />
		</SubList>
		<SubList label="Send"
			 value={open === 'openSend'}
			 icon={<SendIcon />}
			 onClick={(e) => {this.handleClick('openSend')}}
		>
		  <SubListItem
		      label="People"
		      classes={classes}
		      icon={<PersonIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Send value={PersonVal} />, SendVal)}
		  />
		  <SubListItem
		      label="Transactions"
		      classes={classes}
		      icon={<TransactionIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Send value={TransactionVal} />, SendVal)}
		  />
		</SubList>
		<SubList label="Connect"
			 value={open === 'openConnect'}
			 icon={<ConnectIcon />}
			 onClick={(e) => {this.handleClick('openConnect')}}
		>
		  <SubListItem
		      label="News"
		      classes={classes}
		      icon={<NewsIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Connect value={NewsVal} />, SendVal)}
		  />
		  <SubListItem
		      label="Events"
		      classes={classes}
		      icon={<EventIcon className={classes.link} />}
		      onClick={(e) => handlePage(<Connect value={EventVal} />, SendVal)}
		  />
		</SubList>
	      </List>
	      {!(open) && 
	       <div className={classes.quote} >
		 <Quote />
	       </div>
	      }
	    </Grid>
	);
    };
};

Home.propTypes = {
    handlePage: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
