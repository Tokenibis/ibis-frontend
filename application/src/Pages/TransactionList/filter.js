import React from 'react';

import Filter from '../__Common__/Filter';

const options = ['Me', 'Following', 'Public'];

function TransactionFilter(props) {
  return <Filter options={options} {...props} />
}

export default TransactionFilter;
