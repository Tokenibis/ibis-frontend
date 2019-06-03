import React from 'react';

import Filter from '../__Common__/Filter';

const options = ['All', 'Following', 'Followers'];

function PersonFilter(props) {
  return <Filter title="People" options={options} {...props} />
}

export default PersonFilter;
