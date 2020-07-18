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
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import GiveIcon from '@material-ui/icons/CardGiftcard';
import SendIcon from '@material-ui/icons/SendOutlined';
import EngageIcon from '@material-ui/icons/MapOutlined';
import NonprofitIcon from '@material-ui/icons/StoreOutlined';
import DonationIcon from '@material-ui/icons/MonetizationOnOutlined';
import PersonIcon from '@material-ui/icons/AccountCircleOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/Event';
import PostIcon from '@material-ui/icons/ForumOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import DepositIcon from '@material-ui/icons/LocalAtm';
import WithdrawalIcon from '@material-ui/icons/Atm';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/HelpOutline';

import Link from '../../__Common__/CustomLink';
import Sublist from '../../__Common__/Sublist';
import SublistItem from '../../__Common__/SublistItem';
import Amount from '../../__Common__/Amount';

const styles = theme => ({
    username: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	textDecoration: 'none',
    },
    name: {
	color: theme.palette.primary.main,
    },
    home: {
	marginTop: theme.spacing(2),
	color: theme.palette.secondary.main,
    },
    balance: {
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
    },
    nested: {
	paddingLeft: theme.spacing(4),
    },
});

const query = loader('../../Static/graphql/app/SideMenu.gql')

class SideMenu extends Component {

    state = {
	drawer: false,
	expanded: null,
	person_id: '',
	nonprofit_id: '',
	username: '.',
	name: '.',
	balance: 0,
    };

    toggleDrawer = (drawer) => {
	this.setState({ drawer, expanded: null });
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
		person_id: results.data.ibisUser.person ?
			   results.data.ibisUser.person.id : '',
		nonprofit_id: results.data.ibisUser.nonprofit ?
			      results.data.ibisUser.nonprofit.id : '',
		username: results.data.ibisUser.username,
		name: results.data.ibisUser.name,
		balance: results.data.ibisUser.balance,
	    })
	}).catch(error => {
	    console.log(error);
	});

    }

    render() {
	let { classes, context } = this.props;
	let {
	    drawer,
	    expanded,
	    person_id,
	    nonprofit_id,
	    username,
	    name,
	    balance,
	} = this.state;

	let sideMenu = (
	    <div>
  	      <Grid container direction="column" justify="center" alignItems="center">
  		<Grid container direction="column" justify="center" alignItems="center" >
		  <Link to="/">
		    <IconButton className={classes.home} onClick={() => this.toggleDrawer(false)}>
		      <HomeIcon fontSize="large" />
		    </IconButton>
		  </Link>
		  <Typography
		      component={Link}
		      to={context.userType === 'person' ?
			  `/_/Person?id=${person_id}`:
			  `/_/Nonprofit?id=${nonprofit_id}`}
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
		    variant="body2"
		    className={classes.balance}
		  >
		    <Amount amount={balance} label="Balance"/>
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
		  label="Engage"
		  value={expanded === 'Engage'}
		  icon={<EngageIcon />}
		  onClick={(e) => {this.handleExpand('Engage')}}
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
	      <Link to="/_/Deposit">
		<SublistItem
		    label="Deposit"
		    classes={classes}
		    icon={<DepositIcon />}
		    onClick={(e) => this.toggleDrawer(false)}
		/>
	      </Link>
	      {context.userType === 'nonprofit' &&
	       <Link to="/_/Withdrawal">
		 <SublistItem
		     label="Withdrawal"
		     classes={classes}
		     icon={<WithdrawalIcon />}
		     onClick={(e) => this.toggleDrawer(false)}
		 />
	       </Link>
	      }
	      <Link to="/_/Settings">
		<SublistItem
		    label="Settings"
		    classes={classes}
		    icon={<SettingsIcon />}
		    onClick={(e) => this.toggleDrawer(false)}
		/>
	      </Link>
	      <Link to="/_/Info">
		<SublistItem
		    label="Info"
		    classes={classes}
		    icon={<InfoIcon />}
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
		<div style={{ width: Math.min(400, window.innerWidth * 0.75) }}>
		  {sideMenu}
		</div>
              </SwipeableDrawer>
	    </div>
	);
    };
};

export default withApollo(withStyles(styles)(SideMenu));
