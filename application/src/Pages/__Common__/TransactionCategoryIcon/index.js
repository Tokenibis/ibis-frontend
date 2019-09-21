import React from 'react';
import PropTypes from 'prop-types';
import MoodIcon from '@material-ui/icons/MoodOutlined';
import OccasionIcon from '@material-ui/icons/CakeOutlined';
import TradeIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import KudosIcon from '@material-ui/icons/StarsOutlined';
import GameIcon from '@material-ui/icons/VideogameAssetOutlined';
import OtherIcon from '@material-ui/icons/AcUnit';

function TransactionCategoryIcon({ id, ...other }){
    switch(id) {
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6MQ==':
	    return <MoodIcon  {...other}/>;
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6Mg==':
	    return <OccasionIcon  {...other}/>;
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6Mw==':
	    return <TradeIcon  {...other}/>;
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6NA==':
	    return <KudosIcon  {...other}/>;
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6NQ==':
	    return <GameIcon  {...other}/>;
	case 'VHJhbnNhY3Rpb25DYXRlZ29yeU5vZGU6Ng==':
	    return <OtherIcon {...other}/>;
	default:
	    console.error('Category not found')
    }
};

TransactionCategoryIcon.propTypes = {
    id: PropTypes.string.isRequired,
};

export default TransactionCategoryIcon;
