function CustomDate({ date, variant }) {

    let time = date ? new Date(date) : new Date()
    let now = new Date()

    if (variant === 'long') { 
	return time.toLocaleDateString('en-us', {
	    weekday: 'long',
	    month: 'short',
	    day: 'numeric',
	    year: 'numeric',
	}) + ' at ' + time.toLocaleString('en-us', {
	    hour: 'numeric',
	    minute: 'numeric',
	});
    } else if (variant === 'precise') {
	return time.toLocaleDateString('en-us', {
	    month: 'numeric',
	    day: 'numeric',
	    year: '2-digit',
	}) + ' at ' + time.toLocaleString('en-us', {
	    hour: 'numeric',
	    minute: 'numeric',
	});
    }
    
    let diff = (now.getTime() - time.getTime()) / 1000;

    if (diff < 60) {
	return 'Just now';
    } else if (diff < 60 * 5) {
	return 'A few minutes ago';
    } else if (diff < 60 * 60) {
	let minutes = Math.round(diff / 60)
	return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 60 * 60 * 24) {
	let hours = Math.round(diff / 60 / 60)
	return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < 60 * 60 * 14) {
	let days = Math.round(diff / 60 / 60 / 24)
	return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
	return time.toLocaleDateString('en-us', {
	    month: 'long',
	    day: 'numeric',
	    year: 'numeric',
	});
    }
};

export default CustomDate;
export const LongVal = 'long';
export const PreciseVal = 'precise';
