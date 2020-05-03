import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query } from "react-apollo";
import { loader } from 'graphql.macro';
import Typography from '@material-ui/core/Typography';
import DayPicker from 'react-day-picker';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CalendarIcon from '@material-ui/icons/CalendarToday';

import Filter from '../../__Common__/Filter';
import { IbisConsumer } from '../../Context';

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

const eventStyle = `
.DayPicker-Day--events {
  background-color: #ffcfcf;
}
.DayPicker-Day--past {
  color: #d0d0d0;
}
`;


const nonprofit_options = ['Mine', 'All', 'Following', 'Bookmarked', 'Going'];
const options = ['All', 'Following', 'Bookmarked', 'Going'];

const query = loader('../../Static/graphql/operations/EventListFilter.gql')

class EventFilter extends Component {

    state = {
	expanded: false,
	begin: new Date(),
    }

    handleExpand(expanded) {
	this.setState({ expanded: !this.state.expanded });
    };

    render() {
	let { classes, onClose } = this.props;
	let { expanded, begin } = this.state;

	let handleDayClick = (date) => {
	    let year = date.getFullYear().toString().padStart(4, '0');
	    let month = (date.getMonth() + 1).toString().padStart(2, '0');
	    let day = (date.getDate()).toString().padStart(2, '0');
	    onClose(null, `_Calendar:${year}-${month}-${day}T00:00`);
	};

	let handleMonthChange = (date) => {
	    this.setState({ begin: new Date(Math.max(date, new Date())) })
	};

	let beginY = begin.getFullYear().toString().padStart(4, '0');
	let beginM = (begin.getMonth() + 1).toString().padStart(2, '0');
	let beginD = (begin.getDate()).toString().padStart(2, '0');

	let end = new Date(begin.getFullYear(), begin.getMonth() + 1, 1);

	let endY = end.getFullYear().toString().padStart(4, '0');
	let endM = (end.getMonth() + 1).toString().padStart(2, '0');
	
	let variables = {
	    beginDate: `${beginY}-${beginM}-${beginD}T00:00`,
	    endDate: `${endY}-${endM}-01T00:00`
	};

	return (
	    <IbisConsumer>
	      {context => (
		  <Filter 
		      options={context.userType === 'nonprofit' ? nonprofit_options : options}
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
			      <style>{eventStyle}</style>
			      <Query query={query} variables={variables}>
				{({ loading, error, data }) => {
				    let dates = [];
				    if (Object.keys(data).length !== 0) {
					dates = data.allEvents.edges.map((item, i) => (new Date(item.node.date)))
				    }
				    let modifiers = {
					events: dates,
					past: {
					    before: new Date(),
					},
				    };

				    return (
					<DayPicker
					    className={classes.picker}
						      modifiers={modifiers}
						      month={new Date()}
						      onDayClick={(day) => (handleDayClick(day))}
						      onMonthChange={(day) => (handleMonthChange(day))}
					/>
				    );
				}}
			      </Query>
			    </Collapse>
			  </div>
		      )}
		  {...this.props} />
	      )}
	    </IbisConsumer> 
	);
    };
};

export default withStyles(styles)(EventFilter);
