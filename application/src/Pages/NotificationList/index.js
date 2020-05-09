import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import { loader } from 'graphql.macro';
import { Mutation, withApollo } from "react-apollo";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AnnouncementIcon from '@material-ui/icons/AnnouncementOutlined';
import DepositIcon from '@material-ui/icons/LocalAtm';
import FollowIcon from '@material-ui/icons/HowToReg';
import DonationIcon from '@material-ui/icons/MonetizationOnOutlined';
import TransactionIcon from '@material-ui/icons/SwapHoriz';
import LikeIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/CommentOutlined';
import GiftIcon from '@material-ui/icons/CakeOutlined';
import NewsIcon from '@material-ui/icons/ListAlt';
import EventIcon from '@material-ui/icons/Event';
import PostIcon from '@material-ui/icons/ForumOutlined';

import CustomDivider from '../../__Common__/CustomDivider';
import QueryHelper from '../../__Common__/QueryHelper';
import CustomDate, { LongVal } from '../../__Common__/CustomDate';

const styles = theme => ({
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

const DEFAULT_COUNT = 25;

const notifications_query = loader('../../Static/graphql/operations/NotificationList.gql')

const notifier_query = loader('../../Static/graphql/operations/Notifier.gql')

const click_mutation = loader('../../Static/graphql/operations/NotificationClicked.gql')

const seen_mutation = loader('../../Static/graphql/operations/NotifierSeen.gql')

const CATEGORIES = {
    GA: <AnnouncementIcon color="secondary"/>,
    UD: <GiftIcon color="secondary"/>,
    SD: <DepositIcon color="secondary"/>,
    RF: <FollowIcon color="secondary"/>,
    RD: <DonationIcon color="secondary"/>,
    RT: <TransactionIcon color="secondary"/>,
    RC: <CommentIcon color="secondary"/>,
    RL: <LikeIcon color="secondary"/>,
    FN: <NewsIcon color="secondary"/>,
    FE: <EventIcon color="secondary"/>,
    FP: <PostIcon color="secondary"/>,
    UE: <EventIcon color="secondary"/>,
};


// This maps the backend reference to the front-end pages. So far, the names are the same,
// but things could conceivably change
const LINKS = {
    Nonprofit: (id) => ('/Nonprofit/Nonprofit?id=' + id),
    Donation: (id) => ('/Donation/Donation?id=' + id),
    Person: (id) => ('/Person/Person?id=' + id),
    Transaction: (id) => ('/Transaction/Transaction?id=' + id),
    News: (id) => ('/News/News?id=' + id),
    Event: (id) => ('/Event/Event?id=' + id),
    Post: (id) => ('/Post/Post?id=' + id),
    Deposit: (id) => ('/_/Deposit?id='),
};

class NotificationList extends Component {

    handleClick(mutation, id, reference) {
	let { history } = this.props;

	mutation({ variables: { id }});
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
  				      <CustomDate variant={LongVal} date={item.node.created} />
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

    componentDidMount() {
	let { context, client } = this.props;

	client.query({
	    query: notifier_query,
	    variables: { id: context.userID },
	    fetchPolicy: "no-cache",
	}).then(results => {
	    client.mutate({
		mutation: seen_mutation,
		variables: { id: results.data.ibisUser.notifier.id, lastSeen: new Date() }
	    }).catch(error => {
		console.log(error);
	    });
	}).catch(error => {
	    console.log(error);
	});

    };

    render() {
	let { context } = this.props;

	return (
	    <QueryHelper
		query={notifications_query}
		variables={{
		    forUser: context.userID,
		    first: DEFAULT_COUNT,
		}}
		make={this.make}
		infiniteScroll={true}
	    />
	);
    };
};

export default withRouter(withApollo(withStyles(styles)(NotificationList)));
