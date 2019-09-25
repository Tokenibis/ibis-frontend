/*

   Implement the main menu that appears when the user selects the
   MainBar hamburger icon.

 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import GiveIcon from '@material-ui/icons/CardGiftcard';
import SendIcon from '@material-ui/icons/SendOutlined';
import ExploreIcon from '@material-ui/icons/MapOutlined';
import NonprofitIcon from '@material-ui/icons/StoreOutlined';
import DonationIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/AccountCircleOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import HelpIcon from '@material-ui/icons/HelpOutline';

import Link from '../../__Common__/CustomLink';
import Sublist from '../__Common__/Sublist';
import SublistItem from '../__Common__/SublistItem';
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
    username: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	textDecoration: 'none',
	paddingTop: theme.spacing(1),
    },
    name: {
	color: theme.palette.primary.main,
    },
    balance: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
	textDecoration: 'none',
    },
    sideMenu: {
	minWidth: theme.spacing(28),
    },
    nested: {
	paddingLeft: theme.spacing(4),
    },
});

class SideMenu extends Component {

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
	let { handleFrame } = this.props

	this.setState({ 
	    drawer: false,
	    expanded: null,
	});

	handleFrame(page, switchVal);
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: false }) :
	this.setState({ expanded });
    };

    render() {
	let { classes } = this.props;
	let { drawer, expanded } =this.state;

	const query = gql`
	    query {
		person(id: "UGVyc29uTm9kZTo3NQ==") {
		    id
		    avatar
		    username
		    name
		    balance
		}
	    }
	`;

	let sideMenu = (
	    <div className={classes.sideMenu}>
  	      <Grid container direction="column" justify="center" alignItems="center">
		<Query query={query}>
		  {({ loading, error, data }) => {
		      if (loading) return <LinearProgress className={classes.progress} />;
		      if (error) return `Error! ${error.message}`;
		      return (
  			  <Grid container direction="column" justify="center" alignItems="center" >
  			    <Avatar
				component={Link}
				to="/_/Account"
  				alt="Ibis"
  				src={data.person.avatar}
  				className={classes.avatar}
				onClick={(e) => this.toggleDrawer(false)}
			    />
			    <Typography
				component={Link}
				to="/_/Account"
  				alt="Ibis"
				variant="body2"
				className={classes.username}
				onClick={(e) => this.toggleDrawer(false)}
			      >
			      {`@${data.person.username}`}
			    </Typography>
			    <Typography variant="h6" className={classes.name}>
			      {`${data.person.name}`}
			    </Typography>
			    <Typography
				component={Link}
				to="/_/Bank"
  				alt="Ibis"
				variant="body2"
				className={classes.balance}
				onClick={(e) => this.toggleDrawer(false)}
			      >
			      Balance ${data.person.balance}
			    </Typography>
			  </Grid>
		      );
		  }} 
		</Query>
	      </Grid>
	      <Divider />
	      <Sublist
		  label="Give"
		  value={expanded === 'Give'}
		  icon={<GiveIcon />}
		  onClick={(e) => {this.handleExpand('Give')}}
	      >
		<Link to="/Nonprofit">
		  <SublistItem
		      component={Link}
		      to="/Nonprofit"
		      label="Nonprofits"
		      classes={classes}
		      icon={<NonprofitIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
		<Link to="/Donation">
		  <SublistItem
		      label="Donations"
		      classes={classes}
		      icon={<DonationIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
	      </Sublist>
	      <Sublist
		  label="Send"
		  value={expanded === 'Send'}
		  icon={<SendIcon />}
		  onClick={(e) => {this.handleExpand('Send')}}
	      >
		<Link to="/Person">
		  <SublistItem
		      label="People"
		      classes={classes}
		      icon={<PersonIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
		<Link to="/Transaction">
		  <SublistItem
		      label="Transactions"
		      classes={classes}
		      icon={<TransactionIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
	      </Sublist>
	      <Sublist
		  label="Explore"
		  value={expanded === 'Explore'}
		  icon={<ExploreIcon />}
		  onClick={(e) => {this.handleExpand('Explore')}}
	      >
		<Link to="/News">
		  <SublistItem
		      label="News"
		      classes={classes}
		      icon={<NewsIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
		<Link to="/Event">
		  <SublistItem
		      label="Events"
		      classes={classes}
		      icon={<EventIcon />}
		      onClick={(e) => this.toggleDrawer(false)}
		  />
		</Link>
	      </Sublist>
	      <Link to="/_/Settings">
		<SublistItem
		    label="Settings"
		    classes={classes}
		    icon={<SettingsIcon />}
		    onClick={(e) => this.toggleDrawer(false)}
		/>
	      </Link>
	      <Link to="/_/Help">
		<SublistItem
		    label="Help"
		    classes={classes}
		    icon={<HelpIcon />}
		    onClick={(e) => this.toggleDrawer(false)}
		/>
	      </Link>
	      <Link to="/_/QRScan">
		<SublistItem
		    label="Scanner"
		    classes={classes}
		    icon={<QRIcon />}
		    onClick={(e) => this.toggleDrawer(false)}
		/>
	      </Link>
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
		{sideMenu}
              </SwipeableDrawer>
	    </div>
	);
    };
};

SideMenu.propTypes = {
    handleFrame: PropTypes.func.isRequired,
};

export default withStyles(styles)(SideMenu);
