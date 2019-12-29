/*

   Implement the main menu that appears when the user selects the
   MainBar hamburger icon.

 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import { loader } from 'graphql.macro';
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
import EventIcon from '@material-ui/icons/Event';
import PostIcon from '@material-ui/icons/ForumOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import HelpIcon from '@material-ui/icons/HelpOutline';

import Link from '../../__Common__/CustomLink';
import Sublist from '../__Common__/Sublist';
import SublistItem from '../__Common__/SublistItem';

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

const query = loader('../../Static/graphql/operations/SideMenu.gql')

class SideMenu extends Component {

    state = {
	drawer: false,
	expanded: null,
	avatar: '',
	username: '.',
	name: '.',
	balance: 0,
    };

    toggleDrawer = (drawer) => {
	this.setState({ drawer, expanded: null });
    };

    handleOpen = (event) => {
	this.setState({ anchorEl: event.currentTarget });
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: false }) :
	this.setState({ expanded });
    };

    componentDidMount() {
	let { context, client } = this.props;
	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy: "no-cache",
	}).then(results => {
	    this.setState({
		avatar: results.data.person.avatar,
		username: results.data.person.username,
		name: results.data.person.name,
		balance: results.data.person.balance,
	    })
	}).catch(error => {
	    console.log(error);
	});

    }

    render() {
	let { classes, context } = this.props;
	let { drawer, expanded, avatar, username, name, balance } = this.state;

	let sideMenu = (
	    <div className={classes.sideMenu}>
  	      <Grid container direction="column" justify="center" alignItems="center">
  		<Grid container direction="column" justify="center" alignItems="center" >
  		  <Avatar
		  component={Link}
		  to="/_/Account"
  		  alt="Ibis"
  		  src={avatar}
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
		    {`@${username}`}
		  </Typography>
		  <Typography variant="h6" className={classes.name}>
		    {`${name}`}
		  </Typography>
		  <Typography
		    component={Link}
		    to="/_/Bank"
  		    alt="Ibis"
		    variant="body2"
		    className={classes.balance}
		    onClick={(e) => this.toggleDrawer(false)}
		  >
		    Balance ${(balance/100).toFixed(2)}
		  </Typography>
		</Grid>
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
		<Link to="/Post">
		  <SublistItem
		      label="Posts"
		      classes={classes}
		      icon={<PostIcon />}
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
	      <SublistItem
		  label="Logout"
		  classes={classes}
		  onClick={(e) => context.logout()}
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
		{sideMenu}
              </SwipeableDrawer>
	    </div>
	);
    };
};

export default withApollo(withStyles(styles)(SideMenu));
