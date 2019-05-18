import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Person from '../Person';
import CommentList from '../CommentList';

function Transaction({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Transaction </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    Sender
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    Receiver
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<CommentList />)}>
	    Comment List
	  </div>
	</Grid>
    );
};

Transaction.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Transaction;
