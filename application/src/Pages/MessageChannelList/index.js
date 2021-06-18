import React from 'react';

import MessageList, { ChannelVal}  from '../../__Common__/MessageList';

function MessageChannelList(props) {
    return (
	<MessageList variant={ChannelVal} {...props} />
    );
};

export default MessageChannelList;
