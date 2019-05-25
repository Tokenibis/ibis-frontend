import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import DayPicker from 'react-daypicker';
import Divider from '@material-ui/core/Divider';
import DonationIcon from '@material-ui/icons/CardGiftcard';

import Event from '../Event';
import CustomItem from '../__Common__/CustomItem';

import './style.css'

const styles = theme => ({
    root: {
	width: '100%',
    },
    picker: {
	float: 'center',
	textAlign: 'center',
    },
    today: {
	color: theme.palette.primary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing.unit,
    },
    description: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 2,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing.unit,
    },
})

const QUERY = gql`
    query {
	allEvents {
	    edges {
		node {
		    title
		    description
		}
	    }
	}
    }
`;

class EventList extends Component {

    state = {
	day: new Date().toDateString(),
	expanded: -1,
    };

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: -1 }) :
	this.setState({ expanded });
    };

    onDayClick(date) {
	this.setState({ day: date.toDateString() })
    };
    
    createItem(allEvents) {
	let { classes, handleWindow } = this.props;
	let { expanded } = this.state;

	return (
	    allEvents.edges.map((item, i) => ( 
		<CustomItem
		    key={i}
		    label={
			<Typography variant="body2">
			  {item.node.title}
			</Typography>
		    }
		    value={expanded === i}
		    icon={
			<DonationIcon
			    color="secondary"
			  onClick={(e) => handleWindow(<Event handleWindow={handleWindow}/>)}
			/>
		    }
		    onClick={(e) => {this.handleExpand(i)}}>
		  <Typography variant="body2" className={classes.description}>
		    {item.node.description}
		  </Typography>
		</CustomItem>
	    ))
	);
    };

    render() {
	let { classes } = this.props;
	let { day } = this.state;

	return (
	    <Grid container direction="column" justify="center" alignItems="center">
	      <DayPicker onDayClick={(date) => this.onDayClick(date)} />
	      <Typography variant="body2" className={classes.today} >
		{day}
	      </Typography>
	      <div className={classes.root}>
		<Divider />
		<Query query={QUERY}>
		  {({ loading, error, data }) => {
		      if (loading) return <LinearProgress color="primary" variant="query"/>;
		      if (error) return `Error! ${error.message}`;
		      return this.createItem(data.allEvents);
		  }}
		</Query>
	      </div>
	    </Grid>
	);
    };
};

EventList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventList);
