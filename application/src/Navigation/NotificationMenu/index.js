import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { loader } from 'graphql.macro';
import { Query, Mutation, withApollo } from "react-apollo";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExchangeIcon from '@material-ui/icons/LocalAtm';
import FollowIcon from '@material-ui/icons/HowToReg';
import DonationIcon from '@material-ui/icons/MonetizationOnOutlined';
import MessageIcon from '@material-ui/icons/Send';
import RewardIcon from '@material-ui/icons/SwapHoriz';
import LikeIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import MentionIcon from '@material-ui/icons/RecordVoiceOver';
import UbpIcon from '@material-ui/icons/CakeOutlined';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/Event';
import PostIcon from '@material-ui/icons/ForumOutlined';
import ActivityIcon from '@material-ui/icons/CasinoOutlined';
import IconButton from '@material-ui/core/IconButton';
import NotificationIconYes from '@material-ui/icons/NotificationsActive';
import NotificationIconNo from '@material-ui/icons/Notifications';

import CustomDivider from '../../__Common__/CustomDivider';
import QueryHelper from '../../__Common__/QueryHelper';
import CustomDate from '../../__Common__/CustomDate';
import Poller from '../../__Common__/Poller';

const config = require('../../__config__.json');

const styles = theme => ({
    unseenWrapper: {
	display: 'flex',
    },
    hasUnseen: {
	color: "#ffcfcf",
    },
    stat: {
	fontSize: 12,
	fontWeight: 'bold',
	marginTop: theme.spacing(-2),
    },
    clicked: {
	width: '90%',
	opacity: 0.5,
    },
    unclicked: {
	width: '90%',
    },
    image: {
	marginLeft: '0px',
	paddingLeft: '0px',
    },
    title: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    subtitle: {
	color: theme.palette.tertiary.main,
    },
});

const POLL = 4000;

const DEFAULT_COUNT = 25;

const notifications_query = loader('../../Static/graphql/app/NotificationList.gql')

const notifier_query = loader('../../Static/graphql/app/Notifier.gql')

const click_mutation = loader('../../Static/graphql/app/NotificationClicked.gql')

const seen_mutation = loader('../../Static/graphql/app/NotifierSeen.gql')

const CATEGORIES = {
    ubp: <UbpIcon color="secondary"/>,
    grant: <ExchangeIcon color="secondary"/>,
    withdrawal: <ExchangeIcon color="secondary"/>,
    message: <MessageIcon color="secondary"/>,
    follow: <FollowIcon color="secondary"/>,
    donation: <DonationIcon color="secondary"/>,
    reward: <RewardIcon color="secondary"/>,
    comment: <CommentIcon color="secondary"/>,
    mention: <MentionIcon color="secondary"/>,
    like: <LikeIcon color="secondary"/>,
    news: <NewsIcon color="secondary"/>,
    event: <EventIcon color="secondary"/>,
    post: <PostIcon color="secondary"/>,
    activity: <ActivityIcon color="secondary"/>,
};


// This maps the backend reference to the front-end pages. So far, the names are the same,
// but things could conceivably change
const LINKS = {
    Organization: (id) => ('/organization?id=' + id),
    Donation: (id) => ('/donation?id=' + id),
    Person: (id) => ('/person?id=' + id),
    Reward: (id) => ('/reward?id=' + id),
    News: (id) => ('/news?id=' + id),
    Event: (id) => ('/event?id=' + id),
    Post: (id) => ('/post?id=' + id),
    Activity: (id) => ('/activity?id=' + id),
    Grant: (id) => ('/grant?id=' + id),
    Withdrawal: (id) => ('/withdrawal'),
    MessageDirect: (id) => ('/message-direct-list?id=' + id),
    MessageChannel: (id) => ('/message-channel-list?id=' + id),
};

class NotificationMenu extends Component {

    state = {
	drawer: false,
    }

    handleOpen(mutation, refetch, notifier_id) {
	mutation({ variables: {  id: notifier_id, lastSeen: new Date() } }).then(response => {
	    refetch();
	}).catch(error => {
	    alert('Oops, something went wrong');
	});
	this.setState({ drawer: true })
    }

    handleClick(mutation, id, reference) {
	let { history } = this.props;

	mutation({ variables: { id }});
	this.setState({ drawer: false })
	history.push(LINKS[reference.split(':')[0]](reference.split(':')[1]))
    };

    make = (data) => {
	
	let { classes } = this.props;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Mutation mutation={click_mutation}>
		{
		    mutation => (data.map((item, i) => ( 
			<div
			    className={item.node.clicked ? classes.clicked : classes.unclicked}
			    key={i}
			    >
			  <ListItem
			      button
			      key={i}
			      className={classes.image}
			      onClick={() => {
				  this.handleClick(mutation, item.node.id, item.node.reference)
			      }}
			    >
			    {
				<ListItemIcon>
				  {CATEGORIES[item.node.category]}
				</ListItemIcon>
			    }
			    <div>
			      <ListItemText primary={
				  <div>
				    <Typography variant="body2" className={classes.title}>
				      {`${item.node.description}`}
				    </Typography>
				    <Typography variant="body2" className={classes.subtitle}>
  				      <CustomDate date={item.node.created} />
				    </Typography>
				  </div>
			      } />
			    </div>
			  </ListItem>
			  <CustomDivider />
			</div>
		    )))
		}
	      </Mutation>
	    </Grid>
	);
    };

    render() {
	let { drawer } = this.state;
	let { classes, context } = this.props;

	if (!context.userID) {
	    return (
		<IconButton color="inherit">
		  <NotificationIconNo />
		</IconButton>
	    );
	}

	return (
	    <Query
	      fetchPolicy="no-cache"
	      query={notifier_query}
	      variables={{ id: context.userID }}
	    >
	      {({ loading, error, data, refetch }) => {
		  if (loading) return (
		      <IconButton
			  color="inherit"
			  >
			<NotificationIconNo />
		      </IconButton>
		  )

		  document.title = `${data.user.notifier.unseenCount > 0 ? '('+ data.user.notifier.unseenCount + ') ' : ''}${config.ibis.title}`

		  let refetchWrapper = () => {
		      refetch().then(result => {
			  document.title = `${result.data.user.notifier.unseenCount > 0 ? '('+ result.data.user.notifier.unseenCount + ') ' : ''}${config.ibis.title}`
		      });
		  }

		  return (
		      <div>
			{error ? (
			    <IconButton
			      color="inherit"
			      onClick={() => this.setState({ drawer: true })}
			    >
			      <NotificationIconNo />
			    </IconButton>
			    ):(
				<Poller action={refetchWrapper} pollTime={POLL}>
				  <Mutation mutation={seen_mutation}>
				    {mutation => (
					data.user.notifier.unseenCount > 0 ? (
					    <div className={classes.unseenWrapper}>
					      <IconButton
						className={classes.hasUnseen}
						onClick={() => this.handleOpen(
						    mutation,
						    refetch,
						    data.user.notifier.id,
						)}
						>
						<NotificationIconYes/>
						<div className={classes.stat}>
						  {data.user.notifier.unseenCount}
						</div>
					      </IconButton>
					    </div>
					):(
					    <IconButton
						color="inherit"
						onClick={() => this.handleOpen(
						    mutation,
						    refetch,
						    data.user.notifier.id,
						)}
						>
					      <NotificationIconNo />
					    </IconButton>
					)
				    )}
				  </Mutation>
				</Poller>
			)}
			<SwipeableDrawer
			    open={drawer}
			    anchor="right"
			    onClose={(e) => this.setState({ drawer: false })}
			    onOpen={(e) => this.setState({ anchorEl: e.currentTarget })}
			>
			  <div style={{ width: Math.min(400, window.innerWidth * 0.75) }} />
			  <div style={{ width: Math.min(400, window.innerWidth * 0.75) }}>
			    <QueryHelper
				query={notifications_query}
				variables={{
				    user: context.userID,
				    first: DEFAULT_COUNT,
				}}
				make={this.make}
				scroll={'manual'}
			    />
			  </div>
			</SwipeableDrawer>
		      </div>
		  )			      
	      }}
	    </Query>
	);
    };
    
};

export default withRouter(withApollo(withStyles(styles)(NotificationMenu)));
