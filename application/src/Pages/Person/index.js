import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import LinearProgress from '@material-ui/core/LinearProgress';

import Link from '../../__Common__/CustomLink';
import DonationList from '../DonationList';
import TransactionList from '../TransactionList';
import EventList from '../EventList';
import SimpleEdgeMutation, { FollowVal } from '../__Common__/SimpleEdgeMutation';


const styles = theme => ({
    root: {
	width: '100%',
    },
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing,
    },
    progress: {
	marginTop: theme.spacing(-0.5),
    },
    card: {
	width: '100%',
	backgroundColor: theme.palette.lightBackground.main,
	marginBottom: theme.spacing(3),
    },
    avatar: {
	marginTop: theme.spacing(3),
	width: 100,
	height: 100,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
    },
    actionPay: {
	width: '100%',
	color: theme.palette.secondary.main,
	backgroundColor: 'white',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderColor: theme.palette.secondary.main,
	marginBottom: theme.spacing(3),
    },
    followers: {
	textTransform: 'none',
	color: theme.palette.secondary.main,
    },
    readMore: {
	marginLeft: 'auto',
	marginRight: theme.spacing(2),
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	float: 'right',
    },
    heading: {
	fontSize: '18px',
	color: theme.palette.tertiary.main,
	paddingLeft: theme.spacing(1),
	width: '90%',
	textAlign: 'left',
    },
    viewAll: {
	color: theme.palette.secondary.main,
	width: '90%',
	textAlign: 'right',
	paddingBottom: theme.spacing(3),
	textDecoration: 'none',
    },
})

const QUERY = gql`
    query Person($id: ID! $self: String){
	person(id: $id) {
	    id
	    name
	    username
	    avatar
	    balance
	    followerCount
	    followingCount
	    isFollowing: follower(id: $self) {
		edges {
		    node {
			id
		    }
		}
	    }
	}
    }
`;

class Person extends Component {
    
    processDonations(data) {
	return data;
    }

    processTransactions(data) {
	return data;
    }
    
    processEvents(data) {
	return data;
    }
    
    createPage(node) {
	let { classes, context, id } = this.props;

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
  		<Grid container direction="column" justify="center" alignItems="center" >
  		  <Avatar 
  		      alt="Ibis"
    		      src={node.avatar}
  		      className={classes.avatar}
		  />
		  </Grid>
		<CardContent>
		</CardContent>
		<CardActions>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <div className={classes.action}>
		      <div className={classes.actionLeft}>
			<SimpleEdgeMutation
			    variant={FollowVal}
			    user={context.userID}
			    target={node.id}
			    initial={node.isFollowing.edges.length === 1}
			/>
		      </div>
		      <Button>
			<Typography variant="body2" className={classes.followers}>
			  {`Followers: ${node.followerCount}`}
			</Typography>
		      </Button>
		    </div>
		    <Button
			component={Link}
			prefix={1}
			to={`TransactionCreate?target=${id}`}
			className={classes.actionPay}
		    >
		      Pay
		    </Button>
		  </Grid>
		</CardActions>
	      </Card>
	      <div className={classes.preview} >
  		<Grid container direction="column" justify="center" alignItems="center" >
		  <Typography variant="button" className={classes.heading} >
		    Donation History
		  </Typography>
		  <DonationList
		      variant="minimal"
		      context={context}
		      filterValue={`_User:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      prefix={1}
		      to={`DonationList?filterValue=_User:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all donations
		  </Typography>
		  <Typography variant="button" className={classes.heading} >
		    Transaction History
		  </Typography>
		  <TransactionList
		      variant="minimal"
		      context={context}
		      filterValue={`_User:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      prefix={1}
		      to={`TransactionList?filterValue=_User:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all transactions
		  </Typography>
		  <Typography variant="button" className={classes.heading} >
		    Events Going
		  </Typography>
		  <EventList
		      variant="minimal"
		      context={context}
		      filterValue={`_Going:${id}`}
		      count={3}
		  />
		  <Typography
		      component={Link}
		      prefix={1}
		      to={`EventList?filterValue=_Going:${id}`}
		      variant="body2"
		      className={classes.viewAll}
		  >
		    View all events
		  </Typography>
		</Grid>
	      </div>
	    </div>
	); 
    }
    
    render() {
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="no-cache"
		query={QUERY}
		variables={{ id, self: context.userID }}
	    >
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.person);
	      }}
	    </Query>
	);
    };
};

Person.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Person);
