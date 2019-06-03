import React from 'react';

import Filter from '../__Common__/Filter';

const options = ['All', 'Featured', 'Popular', 'Favorites'];

function NonprofitFilter(props) {
  return <Filter title="Nonprofits" options={options} {...props} />
}

export default NonprofitFilter;
