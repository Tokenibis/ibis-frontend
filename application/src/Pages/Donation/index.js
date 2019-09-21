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
import NonprofitCategoryIcon from '../__Common__/NonprofitCategoryIcon';

const styles = theme => ({
    root: {
	flexGrow: 1,
	paddingTop: theme.spacing(4),
    },
    categoryIcon: {
	color: theme.palette.tertiary.main,
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
    },
});

const QUERY = gql`
    query Donation($id: ID!){
	donation(id: $id){
	    id
	    description 
	    amount
	    created
	    likeCount
	    user {
		id
		username
		name
		avatar
		person {
		    id
		}
	    }
	    target {
		id
		title
		category {
		    id
		}
	    }
	}
    }
`;

class Donation extends Component {

    createPage(donation) {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Grid container>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${donation.user.person.id}`}
  			alt="Ibis"
    			src={donation.user.avatar}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div>
		    <Typography variant="body2" className={classes.header}>
		      {`${donation.user.name}`}
		      {<ToIcon className={classes.toIcon} />}
		      {donation.target.title}
		    </Typography>
		  </div>
		</Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.created}>
  		    {new Date(donation.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.gift}>
		    {`$${donation.amount} (~${Math.round(donation.amount/7.5*10)/10} Burritos)`}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.description}>
  		    {donation.description}
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
		      <LikeIcon className={classes.statIcon}/> ({donation.likeCount})
		    </IconButton>
		    <NonprofitCategoryIcon
			id={donation.target.category.id}
			className={classes.categoryIcon}
		    />
		    <IconButton className={classes.stats}>
		      <CommentIcon className={classes.statIcon}/> (0)
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

	return (
	    <Query query={QUERY} variables={{ id }}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.donation);
	      }}
	    </Query>
	);
    };
};

Donation.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Donation);
