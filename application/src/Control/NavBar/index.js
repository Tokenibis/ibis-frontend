import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Window from '../Window'

function TabContainer({ children }) {
    return (
	<Typography component="div" style={{ padding: 8 * 3 }}>
	  <Window>
	    {children}
	  </Window>
	</Typography>
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
});

class NavBar extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    value: props.value,
	    children: props.children
	};
    }

    componentWillReceiveProps({ value, children }) {
	this.setState({ value, children });
    }

    handleChange = (event, value) => {
	this.setState({ value, children: null });
    };

    render() {
	let { classes, options, children } = this.props;
	let { value } = this.state;

	return (
	    <div className={classes.root}>
	      <AppBar color="default" position="static">
		<Tabs
		    indicatorColor="primary"
		    variant="fullWidth"
		    value={value}
		    onChange={this.handleChange}
		>
		  {Object.keys(options).map((label, i) => (
		      <Tab key={i} label={label}/>
		  ))}
		</Tabs>
	      </AppBar>
	      {
		  children ?
		  <TabContainer>{children}</TabContainer> :
		  <TabContainer>{options[Object.keys(options)[value]]}</TabContainer>
	      }
	    </div>
	);
    }
};

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    options: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
