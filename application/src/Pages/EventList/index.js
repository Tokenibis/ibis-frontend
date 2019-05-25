import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DayPicker from 'react-daypicker';

import Event from '../Event';

import './style.css'

const styles = theme => ({
    picker: {
	float: 'center',
	textAlign: 'center',
    },
    eventList: {
	width: '90%',
    },
    today: {
	color: theme.palette.primary.main,
	fontWeight: 'bold',
	paddingBottom: theme.spacing.unit,
    },
})

class EventList extends Component {

    state = {
	day: new Date().toDateString(),
    };

    onDayClick(date) {
	this.setState({ day: date.toDateString() })
    };
    
    render() {
	let { handleWindow, classes } = this.props;
	let { day } = this.state;

	return (
	    <div className={classes.eventList}>
	      <Grid container direction="column" justify="center" alignItems="center">
		<DayPicker onDayClick={(date) => this.onDayClick(date)} />
		<Typography variant="body2" className={classes.today} >
		  {day}
		</Typography>
		<div style={{ color: "#b0bf25" }}
		     onClick={(e) => handleWindow(<Event />)}>
		  Event 1
		</div>
		<div style={{ color: "#b0bf25" }}
		     onClick={(e) => handleWindow(<Event />)}>
		  Event 2
		</div>
		<div style={{ color: "#b0bf25" }}
		     onClick={(e) => handleWindow(<Event />)}>
		  ...
		</div>
	      </Grid>
	    </div>
	);
    };
};

EventList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(EventList);
