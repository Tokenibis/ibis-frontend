import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FilterIcon from '../../__Common__/FilterIcon';
import Window from '../__Common__/Window'

function TabContainer({ children }) {
    return (
	<Window>
	  {children}
	</Window>
    );
}

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
	marginTop: theme.spacing.unit,
	marginRight: theme.spacing.unit,
    },
});

class NavBar extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    tabValue: props.value,
	    children: props.children,
	    openedFilter: -1,
	    filterValue: 0,
	};
    }

    componentWillReceiveProps({ value, children }) {
	this.setState({ tabValue: value, children });
    };

    handleTabClick(tabValue) {
	this.setState({ tabValue });
    }

    handleFilterOpen(openedFilter) {
	this.setState({ openedFilter })
    };

    handleFilterClose(tabValue, filterValue) {
	this.setState({ tabValue, filterValue, openedFilter: -1 });
    };

    render() {
	let { classes, options, children } = this.props;
	let { tabValue, openedFilter, filterValue } = this.state;

	return (
	    <div className={classes.root}>
	      <AppBar color="default" position="static">
		<Tabs
		    indicatorColor="primary"
		    variant="fullWidth"
		    value={tabValue}
		>
		  {options.map((opt, i) => (
		      <Tab key={i} label={
			  <div className={classes.tabButtons}>
			    <div
				className={classes.filterButton}
				onClick={() => this.handleFilterOpen(i)}
			      >
			      <FilterIcon />
			    </div>
			    <div onClick={(e) => this.handleTabClick(i)}>
			      {opt[0]}
			    </div>
			    {openedFilter === i && options[i][1]((v) => this.handleFilterClose(i, v))}
			  </div>
		      }/>
		  ))}
		</Tabs>
	      </AppBar>
	      {
		  children ?
		  <TabContainer>{children}</TabContainer> :
		  <TabContainer>{options[tabValue][2]}</TabContainer>
	      }
	    </div>
	);
    }
};

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
};

export default withStyles(styles)(NavBar);
