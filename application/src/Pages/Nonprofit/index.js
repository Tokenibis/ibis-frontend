import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Button from '@material-ui/core/Button';

import DonationList from '../DonationList';
import NewsList from '../NewsList';
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
    media: {
	height: 160,
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

class Nonprofit extends Component {
    
    state = {
	expanded: false,
    }
    
    toggleExpand() {
	this.setState({ expanded: !this.state.expanded });
    }

    processDonations(data) {
	return data;
    }
    
    processNews(data) {
	return data;
    }

    processEvents(data) {
	return data;
    }
    
    createPage(nonprofit) {
	let { classes, handleWindow } = this.props;
	let { expanded } = this.state;

	return (
	    <div className={classes.root}>
	      <Card raised className={classes.card}>
		<CardMedia
		    className={classes.media}
    		    image={require(`../../Static/Images/birds/bird${(nonprofit.description.length) % 10}.jpg`)}
		/>
		<CardContent>
		  <Typography variant="body2" className={classes.description}>
  		    {
			expanded ? 
			nonprofit.description :
			`${nonprofit.description.substring(0, 300)} ...`
		    }
		  </Typography>
		  <Typography variant="body2" className={classes.link}>
		    https://www.trevornoahfoundation.org
		  </Typography>
		</CardContent>
		<CardActions className={classes.action}>
		  <IconButton color="secondary" aria-label="Like">
		    <FollowIcon />
		  </IconButton>
		  <Button className={classes.actionDonate}>
		    Donate
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
		<Button onClick={() => handleWindow(<DonationList />)}>
		  <Typography variant="button" className={classes.heading} >
		    Donations
		  </Typography>
		</Button>
		<DonationList
		    variant="minimal"
		    handleWindow={handleWindow}
		    count={3}
		/>
		<Button onClick={() => handleWindow(<NewsList />)}>
		  <Typography variant="button" className={classes.heading} >
		    News
		  </Typography>
		</Button>
		<NewsList
		    variant="minimal"
		    handleWindow={handleWindow}
		    count={3}
		/>
		<Button onClick={() => handleWindow(<EventList />)}>
		  <Typography variant="button" className={classes.heading} >
		    Events
		  </Typography>
		</Button>
		<EventList
		    variant="minimal"
		    handleWindow={handleWindow}
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
		nonprofit(id: "${id}") {
		    description
		    title
		    user {
			followerCount
		    }
		}
	    }
	`;

	return (
	    <Query query={query}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.nonprofit);
	      }}
	    </Query>
	);
    };
};

Nonprofit.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Nonprofit);
