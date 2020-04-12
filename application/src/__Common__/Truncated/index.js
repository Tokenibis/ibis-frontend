/*
   
   Takes a string of markdown text with an optional length, strips out
   the markup, and returns a truncated string with an elipse if
   necessary.
   
*/

import PropTypes from 'prop-types';

const removeMd = require('remove-markdown');

const DEFAULT_LENGTH = 320;

function Truncated({ text, length }) {
    length = length ? length : DEFAULT_LENGTH

    text = removeMd(text);

    if (text.length <= length) {
	return text;
    } else {
	return text.slice(0, length - 3).split(' ').slice(0, -1).join(' ') + '...';
    }
}

Truncated.propTypes = {
    text: PropTypes.string.isRequired,
};


export default Truncated;
