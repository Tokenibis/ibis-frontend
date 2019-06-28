import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

import QueryHelper from "../__Common__/QueryHelper";
import ListView from '../__Common__/ListView';
import Nonprofit from '../Nonprofit';
import Filter from '../__Common__/Filter';

import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

const styles = theme => ({
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
    },
    name: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
    },
    username: {
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing(2),
	paddingLeft: theme.spacing(1),
    },
    categoryIcon: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    info: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
});

const DEFAULT_COUNT = 25;

class NonprofitList extends Component {

    constructor({ handlePage, count }) {
	super();

	this.query = gql`
	    query {
  		allNonprofits(first: ${count ? count : DEFAULT_COUNT}) {
  		    edges {
  			node {
			    id
  			    title
  			    description
			    user {
				username
			    }
  			}
  		    }
  		}
	    }
	`;

	this.icons = [
	    <AnimalIcon />,
	    <ArtIcon />,
	    <CivilIcon />,
	    <DevelopmentIcon />,
	    <EducationIcon />,
	    <EnvironmentIcon />,
	    <HealthIcon />,
	    <HumanIcon />,
	]
    };

    makeImage = (node) => {
	let { classes, handlePage } = this.props;
	return (
    	    <Avatar
  		onClick={(e) => handlePage(<Nonprofit id={node.id} />)}
  		alt="Ibis"
    		src={require(`../../Static/Images/birds/bird${(node.description.length) % 10}.jpg`)}
    		className={classes.avatar}
	    />
	)
    };

    makeLabel = (node) => {
	let { classes } = this.props;
	return (
	    <div>
  	      <Typography variant="body2" className={classes.name}>
  		{node.title}
  	      </Typography>
  	      <Typography variant="body2" className={classes.username}>
  		{`@${node.user.username}`}
  	      </Typography>
	    </div>
	);
    }

    makeBody = (node) => {
	return (
  	    <Typography variant="body2">
  	      {`${node.description.substring(0, 300)} ...`}
  	    </Typography>
	);
    }

    makeActions = (node) => {
	let { classes, handlePage } = this.props;
	return (
	    <div className={classes.action}>
	      <IconButton color="secondary" aria-label="Like">
		<LikeIcon />
	      </IconButton>
	      <IconButton
		  className={classes.categoryIcon}
	      >
		{this.icons[(node.description.length) % this.icons.length]}
	      </IconButton>
	      <Button onClick={(e) => handlePage(<Nonprofit id={node.id} />)}>
		<Typography variant="body2" className={classes.info}>
		  More info
		</Typography>
	      </Button>
	    </div>
	);
    };

    makeListDefault = (data) => {
	return (
	    <ListView
		scrollButton
		filter={this.filter}
		makeImage={this.makeImage}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    makeListMinimal = (data) => {
	return (
	    <ListView
		filter={this.filter}
		makeLabel={this.makeLabel}
		makeBody={this.makeBody}
		makeActions={this.makeActions}
		data={data[Object.keys(data)[0]]}
	    {...this.props}
	    />
	);
    };

    render() {
	let { variant } = this.props;
	let makeList;

	switch (variant) {
	    case 'minimal':
		makeList = this.makeListMinimal;
		break;
	    default:
		makeList = this.makeListDefault;
	};

	return <QueryHelper query={this.query} makeList={makeList} {...this.props} />;
    };
};

NonprofitList.propTypes = {
    classes: PropTypes.object.isRequired,
};

function NonprofitFilter(props) {
    return <Filter options={['All', 'Featured', 'Popular', 'Favorites']} {...props} />;
}

export { NonprofitFilter };
export default withStyles(styles)(NonprofitList);
