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

import Link from '../../__Common__/CustomLink';
import Sublist from '../__Common__/Sublist';
import SublistItem from '../__Common__/SublistItem';
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
    name: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	textDecoration: 'none',
	paddingTop: theme.spacing(1),
    },
    notifications: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
	textDecoration: 'none',
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
	paddingTop: theme.spacing(3),
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
	let { classes } = this.props;
	let { expanded } = this.state;

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

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
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
			/>
			  <Typography
			      component={Link}
			      to="/_/Account"
  			      alt="Ibis"
			      variant="body2"
			      className={classes.name}
			    >
			    {`${data.person.name}`}
			  </Typography>
			  <Typography variant="h6" className={classes.balance}>
			    Balance ${data.person.balance}
			  </Typography>
			</Grid>
		    );
		}}
	      </Query>
	      <Typography
		  component={Link}
		  to="/_/Notifications"
  		  alt="Ibis"
		  variant="body2"
		  className={classes.notifications}
	      >
		Notifications ({<NotificationIcon className={classes.notificationIcon} />})
	      </Typography>
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
		  <Link to="/Nonprofit">
		    <SublistItem label="Nonprofits" classes={classes} icon={<NonprofitIcon />} />
		  </Link>
		  <Link to="/Donation">
		    <SublistItem label="Donations" classes={classes} icon={<DonationIcon />} />
		  </Link>
		</Sublist>
		<Sublist
		    label="Send"
		    value={expanded === 'Send'}
		    icon={<SendIcon />}
		    onClick={(e) => {this.handleExpand('Send')}}
		>
		  <Link to="/Person">
		    <SublistItem label="People" classes={classes} icon={<PersonIcon />} />
		  </Link>
		  <Link to="/Transaction">
		    <SublistItem label="Transactions" classes={classes} icon={<TransactionIcon />} />
		  </Link>
		</Sublist>
		<Sublist
		    label="Explore"
		    value={expanded === 'Explore'}
		    icon={<ExploreIcon />}
		    onClick={(e) => {this.handleExpand('Explore')}}
		>
		  <Link to="/News">
		    <SublistItem label="News" classes={classes} icon={<NewsIcon />} />
		  </Link>
		  <Link to="/Event">
		    <SublistItem label="Events" classes={classes} icon={<EventIcon />} />
		  </Link>
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
