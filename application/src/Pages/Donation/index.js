import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Nonprofit from '../Nonprofit';
import CommentList from '../CommentList';

function Donation({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Donation </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Nonprofit />)}>
	    Nonprofit
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<CommentList />)}>
	    Comment List
	  </div>
	</Grid>
    );
};

Donation.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Donation;
