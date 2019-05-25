import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import Give, { NonprofitVal } from '../Give'
import Send, { PersonVal } from '../Send'
import Connect, { NewsVal } from '../Connect'

const cycleMap = {
    '': null,
    'Give': <Give value={NonprofitVal} />,
    'Send': <Send value={PersonVal} />,
    'Connect': <Connect value={NewsVal} />,
};

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
	let { handlePage, value } = this.props;
	let nextVal = value % (Object.keys(cycleMap).length - 1) + 1;

	return (
	    <Button
		color="inherit"
		onClick={(e) => (handlePage(cycleMap[Object.keys(cycleMap)[nextVal]], nextVal))}
	    >
	      {title && `${title}`}
	    </Button>
	);
    }
};

Cycler.propTypes = {
    value: PropTypes.number.isRequired,
    handlePage: PropTypes.func.isRequired,
};

export const BlankVal = Object.keys(cycleMap).indexOf('');
export const GiveVal = Object.keys(cycleMap).indexOf('Give');
export const SendVal = Object.keys(cycleMap).indexOf('Send');
export const ConnectVal = Object.keys(cycleMap).indexOf('Connect');
export default Cycler;
