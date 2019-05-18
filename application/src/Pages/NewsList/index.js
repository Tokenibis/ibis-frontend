import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import News from '../News';

function NewsList({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> News List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<News />)}>
	    News 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<News />)}>
	    News 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<News />)}>
	    ...
	  </div>
	</Grid>
    );
};

NewsList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default (NewsList);
