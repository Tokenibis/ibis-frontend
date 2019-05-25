import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import ModernDatepicker from 'react-modern-datepicker';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import RSVPIcon from '@material-ui/icons/CalendarToday';
import NonprofitIcon from '@material-ui/icons/CardGiftcard';
import UpIcon from '@material-ui/icons/ArrowUpward';

import Event from '../Event';
import Nonprofit from '../Nonprofit';

const styles = theme => ({
    body: {
	paddingTop: theme.spacing.unit,
	width: '100%',
    },
    pickerPaper: {
	width: '100%',
	background: theme.palette.secondary.main,
	zIndex: 1,
    },
    picker: {
	fontWeight: 'bold',
	background: theme.palette.secondary.main,
	textAlign: 'center',
	color: '#ffffff'
    },
    avatar: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    title: {
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
    },
    subheader: {
	color: theme.palette.tertiary.main,
    },
    nonprofitIcon: {
	fontSize: 18,
	marginBottom: -4,
	marginRight: theme.spacing.unit,
    },
    fab: {
	position: 'fixed',
	float: 'right',
	bottom: theme.spacing.unit * 3,
	right: theme.spacing.unit * 3,
    },
    description: {
	color: theme.palette.tertiary.main,
    },
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    card: {
	width: '100%',
	marginBottom: theme.spacing.unit,
    },
    media: {
	height: 160,
    },
    readMore: {
	marginLeft: 'auto',
	marginRight: theme.spacing.unit * 2,
	color: theme.palette.secondary.main,
	fontWeight: 'bold',
	float: 'right',
    }
})

const QUERY = gql`
    query {
	allEvents {
	    edges {
		node {
		    title
		    description
		    created
		}
	    }
	}
    }
`;

class EventList extends Component {

    state = {
	day: new Date().toLocaleDateString()
    };

    onDayClick(day) {
	this.setState({ day })
    };
    
    createItem(allEvents) {
	let { classes, handleWindow } = this.props;

	return (
	    allEvents.edges.map((item, i) => ( 
		<Card raised className={classes.card}>
		  <CardHeader
		      avatar={
			  <div>
  			    <Avatar
		              onClick={(e) => handleWindow(<Nonprofit />)}
				      alt="Ibis"
  				      src={require('../../Static/Images/nonprofit.jpg')}
  				      className={classes.avatar} />
			  </div>

		      }
		      title={
			  <Typography
		              onClick={(e) => handleWindow(<Event />)}
				      variant="body2"
				      className={classes.title}
			      >
			    {item.node.title}
			  </Typography>
		      }
		      subheader={
			  <Typography variant="body2" className={classes.subheader}>
			    {<NonprofitIcon className={classes.nonprofitIcon} />}
			    {new Date(allEvents.edges[0].node.created).toLocaleString()}
			  </Typography>
		      }
		  />
		  <CardContent>
		    <Typography variant="body2" className={classes.description}>
		      {item.node.description}
		    </Typography>
		  </CardContent>
		  <CardActions>
		    <IconButton color="secondary" aria-label="Like">
		      <LikeIcon />
		    </IconButton>
		    <IconButton color="secondary" aria-label="RSVP">
		      <RSVPIcon />
		    </IconButton>
		    <Typography
		        onClick={(e) => handleWindow(<Event />)}
			variant="body2"
			className={classes.readMore}
		    >
		      More info...
		    </Typography>
		  </CardActions>
		</Card>

	    ))
	);
    };

    render() {
	let { classes } = this.props;
	let { day } = this.state;
	console.log(day)

	return (
	    <div>
	      <Paper elevation={8} className={classes.pickerPaper}>
		<ModernDatepicker 
		    className={classes.picker}
		    primaryTextColor="#9b9b9b"
		    secondaryTextColor="#ffffff"
		    primaryColor="#b0bf24"
		    format={'M/D/YYYY'} 
		    onFocus={() => {document.activeElement.setAttribute("readonly", "readonly")}}
		    onChange={(date) => this.onDayClick(date)}
		    date={day}
		/>
	      </Paper>
	      <div className={classes.body}>
		<Query query={QUERY}>
		  {({ loading, error, data }) => {
		      if (loading) return <LinearProgress color="primary" variant="query"/>;
		      if (error) return `Error! ${error.message}`;
		      return this.createItem(data.allEvents);
		  }}
		</Query>
	      </div>
	      <div className={classes.fab} onClick={(e) => {window.scrollTo(0, 0)}}>
		<Fab color="primary">
		  <UpIcon />
		</Fab>
	      </div>
	    </div>
	);
    };
};

EventList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventList);
