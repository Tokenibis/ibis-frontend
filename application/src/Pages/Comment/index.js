import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Person from '../Person';

function Comment({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Comment </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<Person />)}>
	    Person
	  </div>
	</Grid>

    );
};

Comment.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default Comment;
