import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import RSVPIcon from '@material-ui/icons/CalendarToday';
import NonprofitIcon from '@material-ui/icons/CardGiftcard';
import ScrollToTop from "react-scroll-up";
import UpIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';
import DayPicker from 'react-day-picker';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CalendarIcon from '@material-ui/icons/Today';

import Event from '../Event';
import Nonprofit from '../Nonprofit';

import './style.css';

const birthdayStyle = `.DayPicker-Day--highlighted {
  color: #b0bf24;
}`;

const modifiers = {
    highlighted: [
	new Date(2019, 4, 19),
	new Date(2019, 4, 29),
    ]
};

const styles = theme => ({
    body: {
	paddingTop: theme.spacing.unit,
	width: '100%',
    },
    expansion: {
	backgroundColor: theme.palette.secondary.main,
    },
    expansionText: {
	color: '#ffffff',
    },
    picker: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    avatar: {
	borderStyle: 'solid',
	borderWidth: '2px',
	borderColor: theme.palette.secondary.main,
    },
    title: {
	color: theme.palette.primary.main,
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
    calendarIcon: {
	fontSize: 18,
	marginBottom: -4,
	marginRight: theme.spacing.unit,
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
	day: new Date().toLocaleDateString(),
	expanded: false
    };

    handleExpand() {
	this.setState({ expanded: !this.state.expanded });
    }

    handleDayClick(day) {
	this.setState({
	    day: new Date(day).toLocaleDateString(),
	    expanded: false
	})
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
  				      src={require(`../../Static/Images/birds/bird${(item.node.title.length + i) % 10}.jpg`)}
  				      className={classes.avatar} />
			  </div>

		      }
		      title={
			  <Typography
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
	let { day, expanded } = this.state;

	return (
	    <div>
	      <Paper elevation={8}>
	      <ExpansionPanel expanded={expanded} onChange={() => this.handleExpand()}>
		<ExpansionPanelSummary className={classes.expansion}
		    expandIcon={<ExpandMoreIcon className={classes.expansionText} />}
		    aria-controls="panel1a-content"
		    id="panel1a-header"
		>
		  <Typography className={classes.expansionText} variant="button">
		    {<CalendarIcon className={classes.calendarIcon} />} 
		    {day.toLocaleString()}
		  </Typography>
		</ExpansionPanelSummary>
		<ExpansionPanelDetails>
  		  <Grid container direction="column" justify="center" alignItems="center" >
		    <style>{birthdayStyle}</style>
		    <DayPicker
			className={classes.picker}
			modifiers={modifiers}
			month={new Date(2019, 4)}
			onDayClick={(day) => (this.handleDayClick(day))}
		    />
		    </Grid>
		</ExpansionPanelDetails>
	      </ExpansionPanel>
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
	      <ScrollToTop showUnder={160}>
		<Fab color="primary">
		  <UpIcon />
		</Fab>
	      </ScrollToTop>
	    </div>
	);
    };
};

EventList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventList);
