/*

   Handles the behavior of the Give<->Send<->Explore cycler in the
   middle of MainBar. It is rendered by MainBar, using state from
   Content, and has capability to switch NavBar tabs and render the
   default page for each cyle.

*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import Give, { NonprofitVal } from '../Give'
import Send, { PersonVal } from '../Send'
import Explore, { NewsVal } from '../Explore'

const styles = theme => ({
    arrow: {
    },
});

const cycleMap = {
    '': null,
    'Give': <Give value={NonprofitVal} />,
    'Send': <Send value={PersonVal} />,
    'Explore': <Explore value={NewsVal} />,
};


const mod = (a, n) => {
    return a - (n * Math.floor(a/n));
}

class Cycler extends Component {
    constructor () {
	super();
	this.state = { title: '' };
    }

    componentWillReceiveProps({ value }) {
	this.setState({ title: Object.keys(cycleMap)[value] });
    }

    render() {
	let { title } = this.state;
	let { classes, handleFrame, value } = this.props;
	let prevVal = mod(value - 1 - 1, Object.keys(cycleMap).length - 1) + 1;
	let nextVal = mod(value - 1 + 1, Object.keys(cycleMap).length - 1) + 1;

	return (
	    <div>
	    {
	      title && (
	      <div>
		<IconButton
		    color="inherit"
		    className={classes.arrow}
		    onClick={(e) => (
		  handleFrame(cycleMap[Object.keys(cycleMap)[prevVal]], prevVal)
		  )}
		>
		  <ArrowLeftIcon />
		</IconButton>
		<Typography color="inherit" variant="button">
		  {title && title}
		</Typography>
		<IconButton
		    color="inherit"
		    className={classes.arrow}
		    onClick={(e) => (
		  handleFrame(cycleMap[Object.keys(cycleMap)[nextVal]], nextVal)
		  )}
		>
		  <ArrowRightIcon />
		</IconButton>
	      </div>
	      )
	    }		  
	    </div>
	);
    }
};

Cycler.propTypes = {
    value: PropTypes.number.isRequired,
    handleFrame: PropTypes.func.isRequired,
};

export const BlankVal = Object.keys(cycleMap).indexOf('');
export const GiveVal = Object.keys(cycleMap).indexOf('Give');
export const SendVal = Object.keys(cycleMap).indexOf('Send');
export const ExploreVal = Object.keys(cycleMap).indexOf('Explore');

export default withStyles(styles)(Cycler);
