import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import CommentList from '../CommentList';

function News({ handleWindow }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> News </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handleWindow(<CommentList />)}>
	    Comment List
	  </div>
	</Grid>
    );
};

News.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default News;
