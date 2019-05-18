import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Person from '../Person';

function PersonList({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Person List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    Person 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    Person 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    ...
	  </div>
	</Grid>
    );
};

PersonList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (PersonList);
