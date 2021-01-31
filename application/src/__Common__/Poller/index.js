import React, { useEffect } from 'react';

function Poller({ children, action, pollTime }) {

    let focused = true;

    if (pollTime && pollTime > 0) {
	window.addEventListener('focus', () => { focused = true; });
	window.addEventListener('blur', () => { focused = false; });
    }

    useEffect(() => {
	const interval = setInterval(() => {
	    if (pollTime && pollTime > 0 && focused) {
		action();
	    }
	}, pollTime);
	return () => clearInterval(interval);
    }, []);

    return children;
}

export default Poller;
