import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import Link from '../../__Common__/CustomLink';
import CustomDivider from '../../__Common__/CustomDivider';

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
	flexGrow: 1,
	paddingTop: theme.spacing(4),
    },
    categoryIcon: {
	color: theme.palette.primary.main,
	fontSize: 20,
	marginBottom: -4,
    },
    avatarContainer: {
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
    },
    avatar: {
 	borderStyle: 'solid',
  	borderWidth: '2px',
  	borderColor: theme.palette.secondary.main,
	position: 'absolute',
	width: 60,
	height: 60,
    },
    header: {
	fontWeight: 'bold',
	color: theme.palette.primary.main,
	paddingBottom: theme.spacing(1),
    },
    created: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(1),
    },
    toIcon: {
	marginBottom: -7,
	marginLeft: 4,
	marginRight: 4,
    }, 
    gift: {
	paddingBottom: theme.spacing(1),
	color: theme.palette.tertiary.main,
	fontWeight: 'bold',
    },
    description: {
	color: theme.palette.tertiary.main,
	paddingBottom: theme.spacing(2),
    },
    stats: {
	color: theme.palette.secondary.main,
	fontSize: 14,
    },
    statIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.secondary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingLeft: theme.spacing(2),
	paddingRight: theme.spacing(2),
    },
});

class Person extends Component {

    constructor({ classes }) {
	super();
	this.icons = [
	    <AnimalIcon className={classes.categoryIcon} />,
	    <ArtIcon className={classes.categoryIcon} />,
	    <CivilIcon className={classes.categoryIcon} />,
	    <DevelopmentIcon className={classes.categoryIcon} />,
	    <EducationIcon className={classes.categoryIcon} />,
	    <EnvironmentIcon className={classes.categoryIcon} />,
	    <HealthIcon className={classes.categoryIcon} />,
	    <HumanIcon className={classes.categoryIcon} />,
	]
    };

    createPage(transfer) {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Grid container>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${transfer.user.id}`}
  			alt="Ibis"
    			src={require(`../../Static/Images/birds/bird${(transfer.user.firstName.length) % 10}.jpg`)}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div>
		    <Typography variant="body2" className={classes.header}>
		      {`${transfer.user.firstName} ${transfer.user.lastName}`}
		      {<ToIcon className={classes.toIcon} />}
		      {transfer.target.nonprofit.title} ({this.icons[(transfer.description.length) % this.icons.length]})
		    </Typography>
		  </div>
		</Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.created}>
  		    {new Date(transfer.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <div className={classes.gift}>
		    {`$${transfer.amount} (~${Math.round(transfer.amount/7.5*10)/10} Burritos)`}
		  </div>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.description}>
  		    {transfer.description}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7} className={classes.divider}>
		  <CustomDivider />
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7} className={classes.divider}>
		  <div className={classes.action}>
		    <IconButton className={classes.stats}>
		      <LikeIcon className={classes.statIcon}/> ({transfer.likeCount})
		    </IconButton>
		    <IconButton className={classes.stats}>
		      <CommentIcon className={classes.statIcon}/> ({transfer.likeCount})
		    </IconButton>
		  </div>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7} className={classes.divider}>
		  <CustomDivider />
		</Grid>
		<Grid item xs={1}></Grid>
	      </Grid>
	    </div>
	);
    }

    render() {
	let { classes, id } = this.props

	const query = gql`
	    query {
		transfer(id: "${id}") {
		    id
		    description 
		    amount
		    created
		    likeCount
		    user {
			id
			username
			firstName
			lastName
		    }
		    target {
			id
			nonprofit {
			    id
			    title
			}
		    }
		}
	    }
	`;

	return (
	    <Query query={query}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.transfer);
	      }}
	    </Query>
	);
    };
};

Person.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Person);
