import React from 'react';

function Temporary(props) {
    return (
	<img
	    style={{
		position: 'fixed',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)'
	    }}
	    src={require('../../Static/Images/construction.png')}
	/>
    );
};

export default Temporary;
