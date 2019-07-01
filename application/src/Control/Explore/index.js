/*

   Render NavBar for the Explore tabs

*/

import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import NewsList, { NewsFilter } from '../../Pages/NewsList';
import EventList, { EventFilter } from '../../Pages/EventList';

const NewsVal = 0;
const EventVal = 1;

const makeNewsFilter = (onClose) => {
    return <NewsFilter open={true} onClose={onClose} />
}

const makeEventFilter = (onClose) => {
    return <EventFilter open={true} onClose={onClose} />
}

const makeNewsList = (filterValue) => {
    return <NewsList filterValue={filterValue} />
}

const makeEventList = (filterValue) => {
    return <EventList filterValue={filterValue} />
}

const options = [
    [
	'News',
	makeNewsFilter,
	makeNewsList,
    ],
    [
	'Events',
	makeEventFilter,
	makeEventList,
    ],
]

function Explore({ value, children }) {
    return (
	<NavBar value={value} options={options}>
	  {children}
	</NavBar>
    )
};

Explore.propTypes = {
    value: PropTypes.number.isRequired,
};

export { NewsVal, EventVal };
export default Explore;
