/*

   Home page for the app. Superficially, you can argue that this
   should be in the Pages folder, but there are a couple good reason
   this should be in control instead. Firstly, it is integral to
   navigation and therefore the struture of the app. Next, and more
   importantly, it is the only "Page" that, like other Navigation
   components, has access to the "handleFrame" function, which renders
   new pages in the full frame rather than in the current window,
   allowing it to modify the state of the main bar.

 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import NotificationIcon from '@material-ui/icons/NotificationsOutlined';
import GiveIcon from '@material-ui/icons/CardGiftcard';
import SendIcon from '@material-ui/icons/SendOutlined';
import ExploreIcon from '@material-ui/icons/MapOutlined';
import NonprofitIcon from '@material-ui/icons/StoreOutlined';
import DonationIcon from '@material-ui/icons/AttachMoney';
import PersonIcon from '@material-ui/icons/PeopleOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/CalendarToday';

import Sublist from '../__Common__/Sublist';
import SublistItem from '../__Common__/SublistItem';
import { BlankVal, GiveVal, SendVal, ExploreVal } from '../Cycler';
import Account from '../../Pages/Account';
import Notifications from '../../Pages/Notifications';
import Give, { NonprofitVal, DonationVal } from '../Give';
import Send, { PersonVal, TransactionVal } from '../Send';
import Explore, { NewsVal, EventVal } from '../Explore';
import Quote from './Quote'

const styles = theme => ({
    list: {
	width: '90%',
	maxWidth: 360,
    },
    progress: {
	marginTop: theme.spacing(1),
    },
    balance: {
	color: theme.palette.primary.main,
    },
    notifications: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing(4),
    },
    notificationIcon: {
	color: theme.palette.secondary.main,
	fontSize: 14,
	marginBottom: -2,
    },
    nested: {
	paddingLeft: theme.spacing(4),
    },
    avatar: {
	marginTop: - theme.spacing(3),
	width: 100,
	height: 100,
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    quote: {
	paddingTop: theme.spacing(6),
	width: '70%',
	maxWidth: 360,
    }
});

class Home extends Component {
    state = {
	expanded: null,
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: null }) :
	this.setState({ expanded });
    };

    render() {
	let { context, classes, handleFrame } = this.props;
	let { expanded } = this.state;

	const query_balance = gql`
	    query {
		ibisUser(id: "${context.userID}") {
		    balance
		}
	    }
	`;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
  	      <Avatar onClick={(e) => handleFrame(<Account />, BlankVal)}
  		      alt="Ibis"
  		      src={require('../../Static/Images/nonprofit.jpg')}
  		      className={classes.avatar} />
	      <Typography variant="h6" className={classes.balance}>
		<Query query={query_balance}>
		  {({ loading, error, data }) => {
		      if (loading) return <LinearProgress className={classes.progress} />;
		      if (error) return `Error! ${error.message}`;
		      return `Balance $${data.ibisUser.balance}`
		  }}
		</Query>
	      </Typography>
	      <div onClick={(e) => handleFrame(<Notifications />, BlankVal)} >
		<Typography variant="body2" className={classes.notifications}>
		  Notifications ({<NotificationIcon className={classes.notificationIcon} />})
		</Typography>
	      </div>
	      <List
		component="nav"
		className={classes.list}
	      >
		<Sublist
		    label="Give"
		    value={expanded === 'Give'}
		    icon={<GiveIcon />}
		    onClick={(e) => {this.handleExpand('Give')}}
		>
		  <SublistItem
		      label="Nonprofits"
		      classes={classes}
		      icon={<NonprofitIcon />}
		      onClick={(e) => handleFrame(<Give value={NonprofitVal} />, GiveVal)}
		  />
		  <SublistItem
		      label="Donations"
		      classes={classes}
		      icon={<DonationIcon />}
		      onClick={(e) => handleFrame(<Give value={DonationVal} />, GiveVal)}
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
		      icon={<PersonIcon />}
		      onClick={(e) => handleFrame(<Send value={PersonVal} />, SendVal)}
		  />
		  <SublistItem
		      label="Transactions"
		      classes={classes}
		      icon={<TransactionIcon />}
		      onClick={(e) => handleFrame(<Send value={TransactionVal} />, SendVal)}
		  />
		</Sublist>
		<Sublist
		    label="Explore"
		    value={expanded === 'Explore'}
		    icon={<ExploreIcon />}
		    onClick={(e) => {this.handleExpand('Explore')}}
		>
		  <SublistItem
		      label="News"
		      classes={classes}
		      icon={<NewsIcon />}
		      onClick={(e) => handleFrame(<Explore value={NewsVal} />, ExploreVal)}
		  />
		  <SublistItem
		      label="Events"
		      classes={classes}
		      icon={<EventIcon />}
		      onClick={(e) => handleFrame(<Explore value={EventVal} />, ExploreVal)}
		  />
		</Sublist>
	      </List>
	      {!(expanded) && 
	       <div className={classes.quote} >
		 <Quote />
	       </div>
	      }
	    </Grid>
	);
    };
};

Home.propTypes = {
    handleFrame: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);