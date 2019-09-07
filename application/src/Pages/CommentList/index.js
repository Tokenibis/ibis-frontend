import React from 'react';

function CommentList() {
    return (
	<img
	    style={{
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	    }}
	    alt="Under Construction"
	    src={require('../../Static/Images/construction.png')}
	/>
    );
};

export default (CommentList);
