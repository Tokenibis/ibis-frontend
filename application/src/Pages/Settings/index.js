import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Bank from '../Bank';

function Settings({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Settings </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Bank />)}>
	    Bank
	  </div>
	</Grid>
    );
};

Settings.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Settings;
