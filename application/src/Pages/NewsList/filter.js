import React from 'react';
import NewsIcon from '@material-ui/icons/ListAlt';

import Filter from '../__Common__/Filter';

const options = ['All', 'Featured', 'My Nonprofits'];

function NewsFilter(props) {
    return (
	<Filter
	    title="News"
	    icon={<NewsIcon />}
	    options={options} {...props}
	/>
    );
}

export default NewsFilter;
