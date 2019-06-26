import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import DonationList from '../DonationList';
import TransactionList from '../TransactionList';
import EventList from '../EventList';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import FollowIcon from '@material-ui/icons/Add';
import LinearProgress from '@material-ui/core/LinearProgress';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

const styles = theme => ({
    root: {
	width: '100%',
    },
    description: {
	color: theme.palette.tertiary.main,
    },
    link: {
	color: theme.palette.secondary.main,
	paddingTop: theme.spacing.unit,
    },
    progress: {
	marginTop: theme.spacing.unit,
    },
    card: {
	width: '100%',
	marginBottom: theme.spacing.unit,
    },
    avatar: {
	marginTop: theme.spacing.unit * 3,
	width: 100,
	height: 100,
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing.unit * 2,
	paddingLeft: theme.spacing.unit,
    },
    actionDonate: {
	width: '100%',
	color: theme.palette.secondary.main,
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    readMore: {
	marginLeft: 'auto',
	marginRight: theme.spacing.unit * 2,
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	float: 'right',
    },
    preview: {
	textAlign: 'center',
    },
    heading: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
})

class Person extends Component {
    
    state = {
	expanded: false,
    }
    
    toggleExpand() {
	this.setState({ expanded: !this.state.expanded });
    }

    processDonations(data) {
	return data;
    }

    processTransactions(data) {
	return data;
    }
    
    processEvents(data) {
	return data;
    }
    
    createPage(person) {
	let { classes, handlePage } = this.props;
	let { expanded } = this.state;

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
  		<Grid container direction="column" justify="center" alignItems="center" >
  		  <Avatar 
  		  alt="Ibis"
    		  src={require(`../../Static/Images/birds/bird${(person.firstName.length) % 10}.jpg`)}
  		  className={classes.avatar}
		  />
		  </Grid>
		<CardContent>
		</CardContent>
		<CardActions className={classes.action}>
		  <IconButton color="secondary" aria-label="Like">
		    <FollowIcon />
		  </IconButton>
		  <Button className={classes.actionDonate}>
		    Pay
		  </Button>
		  <IconButton color="secondary" onClick={() => this.toggleExpand()}>
		    {
			expanded ?
			<ExpandLessIcon /> :
			<ExpandMoreIcon />
		    }
		  </IconButton>
		</CardActions>
	      </Card>
	      <div className={classes.preview} >
		<Button onClick={() => handlePage(<DonationList />)}>
		  <Typography variant="button" className={classes.heading} >
		    Donations
		  </Typography>
		</Button>
		<DonationList
		    variant="minimal"
		    handlePage={handlePage}
		    count={3}
		/>
		<Button onClick={() => handlePage(<DonationList />)}>
		  <Typography variant="button" className={classes.heading} >
		    Transactions
		  </Typography>
		</Button>
		<TransactionList
		    variant="minimal"
		    handlePage={handlePage}
		    count={3}
		/>
		<Button onClick={() => handlePage(<EventList />)}>
		  <Typography variant="button" className={classes.heading} >
		    Events
		  </Typography>
		</Button>
		<EventList
		    variant="minimal"
		    handlePage={handlePage}
		    count={3}
		/>
	      </div>
	    </div>
	); 
    }
    
    render() {
	let { classes, id } = this.props

	const query = gql`
	    query {
		ibisUser(id: "${id}") {
       		    firstName
  		    lastName
		    username
		    balance
		    followerCount
		    followingCount
		    user {
			dateJoined
		    }
		}
	    }
	`;

	return (
	    <Query query={query}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.ibisUser);
	      }}
	    </Query>
	);
    };
};

Person.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Person);
