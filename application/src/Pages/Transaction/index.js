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

import GiftIcon from '@material-ui/icons/CakeOutlined';
import MoodIcon from '@material-ui/icons/MoodOutlined';
import TradeIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import KudosIcon from '@material-ui/icons/StarsOutlined';
import GameIcon from '@material-ui/icons/VideogameAssetOutlined';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';
import Commercial from '@material-ui/icons/ShoppingCartOutlined';

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

class Transaction extends Component {

    constructor({ classes }) {
	super();
	this.icons = [
	    <GiftIcon className={classes.categoryIcon}/>,
	    <MoodIcon className={classes.categoryIcon}/>,
	    <TradeIcon className={classes.categoryIcon}/>,
	    <KudosIcon className={classes.categoryIcon}/>,
	    <GameIcon className={classes.categoryIcon}/>,
	    <SchoolIcon className={classes.categoryIcon}/>,
	    <Commercial className={classes.categoryIcon}/>,
	]
    };

    createPage(transaction) {
	let { classes } = this.props;

	return (
	    <div className={classes.root}>
	      <Grid container>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${transaction.user.id}`}
  			alt="Ibis"
    			src={require(`../../Static/Images/birds/bird${(transaction.user.name.length) % 10}.jpg`)}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div>
		    <Typography variant="body2" className={classes.header}>
		      {`${transaction.user.name}`}
		      {<ToIcon className={classes.toIcon} />}
		      {`${transaction.target.name} ${transaction.target.lastName}`}
		    </Typography>
		  </div>
		</Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.created}>
  		    {new Date(transaction.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.gift}>
		    {`$${transaction.amount} (~${Math.round(transaction.amount/7.5*10)/10} Burritos)`}
		  </Typography>
		</Grid>
		<Grid item xs={1}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.description}>
  		    {transaction.description}
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
		      <LikeIcon className={classes.statIcon}/> (0)
		    </IconButton>
		    {this.icons[(transaction.description.length) % this.icons.length]}
		    <IconButton className={classes.stats}>
		      <CommentIcon className={classes.statIcon}/> ({transaction.likeCount})
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
		transaction(id: "${id}") {
		    id
		    description 
		    amount
		    created
		    likeCount
		    user {
			id
			username
			name
		    }
		    target {
			id
			username
			name
		    }
		}
	    }
	`;

	return (
	    <Query query={query}>
	      {({ loading, error, data }) => {
		  if (loading) return <LinearProgress className={classes.progress} />;
		  if (error) return `Error! ${error.message}`;
		  return this.createPage(data.transaction);
	      }}
	    </Query>
	);
    };
};

Transaction.propTypes = {
    id: PropTypes.string.isRequired,
};

export default withStyles(styles)(Transaction);
