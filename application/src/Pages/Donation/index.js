import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Nonprofit from '../Nonprofit';
import CommentList from '../CommentList';

function Donation({ handleWindow }) {
    return (
	<img
	    style={{
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	    }}
	    src={require('../../Static/Images/construction.png')}
	/>
    );
};

Donation.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Donation;
