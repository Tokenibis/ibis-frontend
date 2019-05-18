import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Deposit from '../Deposit';

function Account({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Account </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Deposit />)}>
	    Deposit
	  </div>
	</Grid>
    );
};

Account.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (Account);
