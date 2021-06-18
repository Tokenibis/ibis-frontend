import React from 'react';

import MessageList, { DirectVal}  from '../../__Common__/MessageList';

function MessageDirectList(props) {
    return (
	<MessageList variant={DirectVal} {...props} />
    );
};

export default MessageDirectList;
