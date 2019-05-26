import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import ScrollToTop from "react-scroll-up";
import UpIcon from '@material-ui/icons/ArrowUpward';
import Fab from '@material-ui/core/Fab';

import Donation from '../Donation';
import CustomItem from '../__Common__/CustomItem';

import AnimalIcon from '@material-ui/icons/PetsOutlined';
import ArtIcon from '@material-ui/icons/PaletteOutlined';
import CivilIcon from '@material-ui/icons/RecordVoiceOverOutlined';
import DevelopmentIcon from '@material-ui/icons/LocationCityOutlined';
import EducationIcon from '@material-ui/icons/LocalLibraryOutlined';
import EnvironmentIcon from '@material-ui/icons/TerrainOutlined';
import HealthIcon from '@material-ui/icons/HealingOutlined';
import HumanIcon from '@material-ui/icons/GroupOutlined';

const styles = theme => ({
    root: {
	width: '100%',
    },
    categoryIcon: {
	color: theme.palette.secondary.main,
	padding: 0,
    },
    toIcon: {
	marginBottom: -8,
	marginLeft: 4,
	marginRight: 4,
    },
    description: {
	textAlign: 'left',
	paddingLeft: theme.spacing.unit * 3,
	paddingRight: theme.spacing.unit * 2,
	color: theme.palette.tertiary.main,
    },
    progress: {
	position: 'absolute',
	top: '50%',
	left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingRight: theme.spacing.unit * 2,
    },
    amount: {
	fontWeight: 'bold',
	color: theme.palette.tertiary.main,
    },
    details: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
    }
})

const QUERY = gql`
    query {
	allTransactions {
	    edges {
		node {
		    id
		    amount
		    description
		    created
		    target {
			firstName
			lastName
			nonprofit {
			    id
			    title
			}
		    }
		    user {
        		firstName
			lastName
		    }
		}
	    }
	}
    }
`;

class DonationList extends Component {

    state = {
	expanded: -1,
    };

    constructor({ handleWindow }) {
	super();
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
    }

    handleExpand(expanded) {
	this.state.expanded === expanded ?
	this.setState({ expanded: -1 }) :
	this.setState({ expanded });
    };

    createItem(allTransactions) {
	let { classes, handleWindow } = this.props;
	let { expanded } = this.state;

	return (
	    allTransactions.edges.map((item, i) => ( 
		item.node.target.nonprofit &&
		<CustomItem
		    key={i}
		    label={
			<Typography variant="body2" className={classes.notifications}>
			  {`${item.node.user.firstName} ${item.node.user.lastName}`}
			  {<ToIcon className={classes.toIcon} />}
			  {item.node.target.nonprofit.title}
			</Typography>
		    }
		    value={expanded === i}
		    icon={
			<IconButton
			    className={classes.categoryIcon}
			    onClick={(e) => handleWindow(<Donation handleWindow={handleWindow}/>)}
			 >
			  {this.icons[(item.node.description.length + i) % this.icons.length]}
			</IconButton>
		    }
		    onClick={(e) => {this.handleExpand(i)}}>
		  <Typography variant="body2" className={classes.description}>
		    {item.node.description}
		  </Typography>
		  <div className={classes.action}>
		    <IconButton color="secondary" aria-label="Like">
		      <LikeIcon />
		    </IconButton>
		    <Typography variant="body2" className={classes.amount}>
		      {`$${item.node.amount}`}
		    </Typography>
		    <Typography variant="body2" className={classes.details}>
		      Details
		    </Typography>
		  </div>
		</CustomItem>
	    ))
	);
    };

    render() {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Query query={QUERY}>
		{({ loading, error, data }) => {
		    if (loading) return <CircularProgress className={classes.progress} />;
		    if (error) return `Error! ${error.message}`;
		    return this.createItem(data.allTransactions);
		}}
	      </Query>
	      <ScrollToTop showUnder={160}>
		<Fab color="primary">
		  <UpIcon />
		</Fab>
	      </ScrollToTop>
	    </div>
	);
    };
};

DonationList.propTypes = {
    handleWindow: PropTypes.func.isRequired,
};

export default withStyles(styles)(DonationList);
