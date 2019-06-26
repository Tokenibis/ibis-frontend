import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Comment from '../Comment';
import CommentCreate from '../CommentCreate';

function CommentList({ handlePage }) {
    return (
	<Grid container direction="column" justify="center" alignItems="center">
	  <p> Comment List </p>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Comment />)}>
	    Comment 1
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Comment />)}>
	    Comment 2
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<Comment />)}>
	    ...
	  </div>
	  <div style={{ color: "#b0bf25" }}
	      onClick={(e) => handlePage(<CommentCreate />)}>
	    Comment Create
	  </div>
	</Grid>
    );
};

CommentList.propTypes = {
    handlePage: PropTypes.func.isRequired,
};

export default (CommentList);
