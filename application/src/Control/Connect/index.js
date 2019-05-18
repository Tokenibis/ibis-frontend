import React from 'react';
import PropTypes from 'prop-types';

import NavBar from '../NavBar';
import NewsList from '../../Pages/NewsList';
import EventList from '../../Pages/EventList';

const NewsVal = 0;
const EventVal = 1;

let options = {
    'News': <NewsList handleWindow={() => {console.error('Not Implemented')}} />,
    'Events': <EventList handleWindow={() => {console.error('Not Implemented')}} />,
};

function Connect({ value, children }) {
    return (
	<NavBar value={value} options={options}>
	  {children}
	</NavBar>
    );
};

Connect.propTypes = {
    value: PropTypes.number.isRequired,
};

export { NewsVal, EventVal };
export default Connect;
