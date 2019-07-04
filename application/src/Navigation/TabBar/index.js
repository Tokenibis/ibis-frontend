/*

   Handle logic for the navigation (tab) bar. TabBar is invoked by the
   Connect, Send, and Explore components, effecively acting as the
   abstracted common functionality between the three of them. In
   addition to rendering the navigation tabs, TabBar determines how
   individual pages are rendered; understandin the TabBar component is
   crucial to understanding how the tab-centric navigation of Ibis
   works.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FilterIcon from '../../__Common__/FilterIcon';
import Window from '../__Common__/Window'

class TabContainer extends Component {
    shouldComponentUpdate({ changeFlag }) {
	return changeFlag;
    }

    render() {
	let { children } = this.props;
	return (
	    <Window>
	      {children}
	    </Window>
	);
    };
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
	flexGrow: 1,
	backgroundColor: theme.palette.primary
    },
    tabButtons: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    filterButton: {
	margin: theme.spacing(-1, -1, -2, -2),
	padding: theme.spacing(2),
	zIndex: 100,
    },
});

class TabBar extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    tabValue: props.value,
	    children: props.children,
	    openedFilter: -1,
	    filterValue: '',
	    changeFlag: true,
	};
    }

    componentWillReceiveProps({ value, children }) {
	this.setState({ tabValue: value, children });
    };

    handleTabClick(tabValue) {
	this.setState({ tabValue, changeFlag: true });
    }

    handleFilterOpen(event, openedFilter) {
	event.stopPropagation();
	this.setState({ openedFilter, changeFlag: false })
    };

    handleFilterClose(event, tabValue, filterValue) {
	event && event.stopPropagation();
	this.setState({
	    filterValue,
	    openedFilter: -1,
	    tabValue: filterValue ? tabValue : this.state.tabValue,
	    changeFlag: filterValue ? true : false
	});
    };

    render() {
	let { classes, options, children } = this.props;
	let { tabValue, openedFilter, filterValue, changeFlag } = this.state;

	return (
	    <div className={classes.root}>
	      <AppBar color="default" position="static">
		<Tabs
		    indicatorColor="primary"
		    variant="fullWidth"
		    value={tabValue}
		>
		  {options.map((opt, i) => (
		      <Tab
			  key={i}
			  onClick={(e) => this.handleTabClick(i)}
			  label={
			  <div className={classes.tabButtons}>
			    <div
				className={classes.filterButton}
				onClick={(e) => this.handleFilterOpen(e, i)}
			      >
			      <FilterIcon />
			    </div>
			    <div>
			      {opt[0]}
			    </div>
			  </div>
			  }
		      />
		  ))}
		</Tabs>
		{options.map((opt, i) => (
		    openedFilter === i && options[i][1]((e, v) => this.handleFilterClose(e, i, v))
		))}
	      </AppBar>
	      <TabContainer changeFlag={changeFlag}>
		{
		    children ?
		    children:
		    options[tabValue][2](filterValue)
		}
	      </TabContainer>
	    </div>
	);
    }
};

TabBar.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
};

export default withStyles(styles)(TabBar);
