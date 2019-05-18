import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Event from '../Event';

function EventList({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Event List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Event />)}>
	    Event 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Event />)}>
	    Event 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Event />)}>
	    ...
	  </div>
	</Grid>
    );
};

EventList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (EventList);
