/*

   Handle logic for the tab bar based on configuration inputs from
   Content. It invokes new routs when the user clicks on the tab or
   selects an input from the filter.

 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';

import FilterIcon from '../../__Common__/FilterIcon';

const styles = theme => ({
    root: {
	flexGrow: 1,
	backgroundColor: theme.palette.primary
    },
    tabs: {
	paddingRight: theme.spacing(2),
    },
    filterButton: {
	paddingLeft: theme.spacing(3.5),
	justifyContent: 'center',
	alignItems: 'center',
	display: 'flex',
	borderColor: theme.palette.secondary.main,
    },
    bottom: {
	position: 'fixed',
	bottom: '0%',
	width: '100%',
	zIndex: 10,
	backgroundColor: '#f5f5f5',
    },
});

class TabBar extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    openedFilter: -1,
	    filterValue: '',
	};
    }

    handleTabClick(tabValue) {
	let { options } = this.props
	this.props.history.push(`/${options[tabValue][2]}`)
    };

    handleFilterOpen(event, openedFilter) {
	event.stopPropagation();
	this.setState({ openedFilter })
    };

    handleFilterClose(event, tabValue, filterValue) {
	let { options } = this.props
	event && event.stopPropagation();

	if (filterValue) {
	    let params = `?filterValue=${filterValue}`;
	    this.props.history.push(`/${options[tabValue][2]}${params}`)
	}
	this.setState({
	    openedFilter: -1,
	    filterValue,
	});
    };

    render() {
	let { classes, value, options, } = this.props;
	let { openedFilter, filterValue } = this.state;

	return (
	    <div className={classes.root}>
	      <AppBar color="default" position="static">
		<Tabs
		    indicatorColor="primary"
		    variant="fullWidth"
		    value={value + 1}
		    className={classes.tabs}
		>
		  <IconButton
		      id="tutorial-filter"
		      className={classes.filterButton}
		      onClick={(e) => this.handleFilterOpen(e, value)}
		  >
		    <FilterIcon />
		  </IconButton>
		  {options.map((opt, i) => (
		      <Tab
			  key={i}
			  onClick={(e) => this.handleTabClick(i)}
			  label={opt[0]}
			  id={`tutorial-tab-${i}`}
		      />
		  ))}
		</Tabs>
		{options.map((opt, i) => (
		    openedFilter === i && options[i][1](
			filterValue, i, (e, v) => this.handleFilterClose(e, i, v)
		    )
		))}
	      </AppBar>
	    </div>
	);
    }
};

TabBar.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
};

export default withRouter(withStyles(styles)(TabBar));
