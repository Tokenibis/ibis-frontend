/*

   Handles the behavior of the Give<->Send<->Engage cycler in the
   middle of MainBar. It is rendered by MainBar using state from
   Content.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import Link from '../../__Common__/CustomLink';

const styles = theme => ({
    arrow: {
    },
});

const cycleMap = {
    '': null,
    'Give': 'Nonprofit',
    'Send': 'Person',
    'Engage': 'News',
};


const mod = (a, n) => {
    return a - (n * Math.floor(a/n));
}

class Cycler extends Component {
    constructor (props) {
	super();
	this.state = { title: Object.keys(cycleMap)[props.value] };
    }

    componentWillReceiveProps({ value }) {
	this.setState({ title: Object.keys(cycleMap)[value] });
    }

    render() {
	let { title } = this.state;
	let { classes, value } = this.props;
	let prevVal = mod(value - 1 - 1, Object.keys(cycleMap).length - 1) + 1;
	let nextVal = mod(value - 1 + 1, Object.keys(cycleMap).length - 1) + 1;

	return (
	    <div>
	    {
	      title && (
	      <div>
		<Link to={`/${cycleMap[Object.keys(cycleMap)[prevVal]]}`}>
		  <IconButton color="inherit" className={classes.arrow}>
		    <ArrowLeftIcon />
		  </IconButton>
		</Link>
		<Typography color="inherit" variant="button">
		  {title && title}
		</Typography>
		<Link to={`/${cycleMap[Object.keys(cycleMap)[nextVal]]}`}>
		  <IconButton color="inherit" className={classes.arrow}>
		    <ArrowRightIcon />
		  </IconButton>
		</Link>
	      </div>
	      )
	    }		  
	    </div>
	);
    }
};

Cycler.propTypes = {
    value: PropTypes.number.isRequired,
};

export const StandardVal = Object.keys(cycleMap).indexOf('');
export const GiveVal = Object.keys(cycleMap).indexOf('Give');
export const SendVal = Object.keys(cycleMap).indexOf('Send');
export const EngageVal = Object.keys(cycleMap).indexOf('Engage');

export default withStyles(styles)(Cycler);
