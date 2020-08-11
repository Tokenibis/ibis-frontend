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
import { withApollo } from 'react-apollo';
import { loader } from 'graphql.macro';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import OrganizationIcon from '@material-ui/icons/Store';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/Event';
import PersonIcon from '@material-ui/icons/People';
import DonationIcon from '@material-ui/icons/MonetizationOn';
import PostIcon from '@material-ui/icons/Forum';
import BotIcon from '@material-ui/icons/Android';
import ActivityIcon from '@material-ui/icons/Casino';
import RewardIcon from '@material-ui/icons/EmojiEvents';

import Link from '../../__Common__/CustomLink';
import Sublist from '../../__Common__/Sublist';
import SublistItem from '../../__Common__/SublistItem';
import Quote from './Quote'
import Amount from '../../__Common__/Amount';

const styles = theme => ({
    list: {
	width: '90%',
	maxWidth: 360,
    },
    progress: {
	marginTop: theme.spacing(1),
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
	fontWeight: 'bold',
	paddingBottom: theme.spacing(2),
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
	backgroundColor: 'white',
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

const query = loader('../../Static/graphql/app/Home.gql')

class Home extends Component {
    state = {
	expanded: null,
	person_id: '',
	organization_id: '',
	avatar: '',
	username: '',
	name: '.',
	balance: 0,

    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: null }) :
	this.setState({ expanded });
    };

    componentDidMount() {
	let { context, client } = this.props;
	client.query({
	    query: query,
	    variables: { id: context.userID },
	    fetchPolicy:"no-cache",
	}).then(results => {
	    this.setState({
		avatar: results.data.user.avatar,
		username: results.data.user.username,
		name: results.data.user.name,
		balance: results.data.user.balance,
	    })
	}).catch(error => {
	    console.log(error);
	});

    }

    render() {
	let { classes, context } = this.props;
	let { expanded, avatar, username, name, balance } = this.state;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
  	      <Grid container direction="column" justify="center" alignItems="center" >
  		<Avatar
		    component={Link}
		    to={`/_/${context.userType}?id=${context.userID}`}
  		    src={avatar}
  		    className={classes.avatar}
		/>
		<Typography
		    component={Link}
		    to={`/_/${context.userType}?id=${context.userID}`}
		    variant="body2"
		    className={classes.username}
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
	      <List
		component="nav"
		className={classes.list}
	      >
		<Sublist
		    label="Organizations"
		    value={expanded === 'Organization'}
		    icon={<OrganizationIcon />}
		    onClick={(e) => {this.handleExpand('Organization')}}
		>
		  <Link to="/Organization">
		    <SublistItem 
			onClick={() => {}} 
			label="Orgs" 
			icon={<OrganizationIcon />} 
		    />
		  </Link>
		  <Link to="/News">
		    <SublistItem 
			onClick={() => {}} 
			label="News" 
			icon={<NewsIcon />} 
		    />
		  </Link>
		  <Link to="/Event">
		    <SublistItem 
			onClick={() => {}} 
			label="Events" 
			icon={<EventIcon />} 
		    />
		  </Link>
		</Sublist>
		<Sublist
		    label="People"
		    value={expanded === 'Person'}
		    icon={<PersonIcon />}
		    onClick={(e) => {this.handleExpand('Person')}}
		>
		  <Link to="/Person">
		    <SublistItem 
			onClick={() => {}} 
			label="People" 
			icon={<PersonIcon />} 
		    />
		  </Link>
		  <Link to="/Donation">
		    <SublistItem 
			onClick={() => {}} 
			label="Donations" 
			icon={<DonationIcon />} 
		    />
		  </Link>
		  <Link to="/Post">
		    <SublistItem
			onClick={() => {}}
			label="Posts"
			icon={<PostIcon />}
		    />
		  </Link>
		</Sublist>
		<Sublist
		    label="Bots"
		    value={expanded === 'Bot'}
		    icon={<BotIcon />}
		    onClick={(e) => {this.handleExpand('Bot')}}
		>
		  <Link to="/Bot">
		    <SublistItem 
			onClick={() => {}} 
			label="Bots" 
			icon={<BotIcon />} 
		    />
		  </Link>
		  <Link to="/Reward">
		    <SublistItem 
			onClick={() => {}} 
			label="Rewards" 
			icon={<RewardIcon />} 
		    />
		  </Link>
		  <Link to="/Activity">
		    <SublistItem 
			onClick={() => {}} 
			label="Activities" 
			icon={<ActivityIcon />} 
		    />
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

export default withApollo(withStyles(styles)(Home));
