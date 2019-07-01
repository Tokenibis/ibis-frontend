import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DayPicker from 'react-day-picker';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CalendarIcon from '@material-ui/icons/CalendarToday';

import Filter from '../__Common__/Filter';

import './filter_style.css';

const styles = theme => ({
    picker: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    label: {
	position: 'relative',
    },
    calendarIcon: {
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    calendarText: {
	paddingLeft: theme.spacing(5),
	paddingRight: theme.spacing(2),
    }
})

const birthdayStyle = `.DayPicker-Day--highlighted {
  color: #b0bf24;
}`;

const modifiers = {
    highlighted: [
	new Date(2019, 5, 19),
	new Date(2019, 5, 29),
    ]
};

const options = ['All', 'Featured', 'Following', 'Going'];

class EventFilter extends Component {

    state = {
	expanded: false,
    }

    handleExpand(expanded) {
	this.setState({ expanded: !this.state.expanded });
    };

    handleDayClick(day) {
	console.log(day)
    };

    render() {
	let { classes } = this.props;
	let { expanded } = this.state;
	return (
	    <Filter 
	    options={options}
	    custom={(
		<div>
		<ListItem button onClick={() => this.handleExpand()}>
		<ListItemText color="inherit" primary={
		    <div className={classes.label}>
		      <div className={classes.calendarIcon}>
			<CalendarIcon />
		      </div>
		      <Typography variant="button" className={classes.calendarText}>
			Calendar
		      </Typography>
		    </div>
		} />
		  {
		      expanded ?
		      <ExpandLess color="secondary"/> :
		      <ExpandMore color="secondary"/>
		  }
		</ListItem>
		<Collapse in={expanded} timeout="auto" unmountOnExit>
		  <DayPicker
		  className={classes.picker}
		  modifiers={modifiers}
		  month={new Date(2019, 4)}
		  onDayClick={(day) => (this.handleDayClick(day))}
		  />
		</Collapse>
		</div>
	    )}
	    {...this.props} />
	);
    };
};

export default withStyles(styles)(EventFilter);
