import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Nonprofit from '../Nonprofit';

function NonprofitList({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Nonprofit List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Nonprofit />)}>
	    Nonprofit 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Nonprofit />)}>
	    Nonprofit 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Nonprofit />)}>
	    ...
	  </div>
	</Grid>
    );
};

NonprofitList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (NonprofitList);
