import PropTypes from 'prop-types';

const DEFAULT_LENGTH = 320;

function Truncated({ text, length }) {
    length = length ? length : DEFAULT_LENGTH

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
