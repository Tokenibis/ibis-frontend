import React from 'react';
import PropTypes from 'prop-types';
import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

function NonprofitCategoryIcon({ id, ...other }){
    switch(id) {
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjE=':
	    return <AnimalIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjI=':
	    return <ArtIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjM=':
	    return <CivilIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjQ=':
	    return <DevelopmentIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjU=':
	    return <EducationIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjY=':
	    return <EnvironmentIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjc=':
	    return <HealthIcon {...other}/>;
	case 'Tm9ucHJvZml0Q2F0ZWdvcnlOb2RlOjg=':
	    return <HumanIcon {...other}/>;
	default:
	    console.error('Category not found')
    }
};

NonprofitCategoryIcon.propTypes = {
    id: PropTypes.string.isRequired,
};

export default NonprofitCategoryIcon;
