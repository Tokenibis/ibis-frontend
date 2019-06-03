import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import NewsFilter from '../../Pages/NewsList/filter';
import EventFilter from '../../Pages/EventList/filter';
import NewsList from '../../Pages/NewsList';
import EventList from '../../Pages/EventList';

const NewsVal = 0;
const EventVal = 1;

const makeNewsFilter = (onClose) => {
    return <NewsFilter open={true} onClose={onClose} />
}

const makeEventFilter = (onClose) => {
    return <EventFilter open={true} onClose={onClose} />
}

const options = [
    [
	'News',
	makeNewsFilter,
	<NewsList />,
    ],
    [
	'Events',
	makeEventFilter,
	<EventList />,
    ],
]

function Connect({ value, children }) {
    return (
	<NavBar value={value} options={options}>
	  {children}
	</NavBar>
    )
};

Connect.propTypes = {
    value: PropTypes.number.isRequired,
};

export { NewsVal, EventVal };
export default Connect;
