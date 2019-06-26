import React from 'react';
import Grid from '@material-ui/core/Grid';

import Nonprofit from '../Nonprofit';
import CommentList from '../CommentList';

function Donation({ handlePage }) {
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

export default Donation;
