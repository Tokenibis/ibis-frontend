import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { loader } from 'graphql.macro';
import { Query } from "react-apollo";
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToIcon from '@material-ui/icons/ArrowRightAlt';
import axios from "axios";

import Link from '../../__Common__/CustomLink';
import SimpleEdgeMutation, { LikeVal } from '../__Common__/SimpleEdgeMutation';
import CommentTree from '../__Common__/CommentTree';

const styles = theme => ({
    content: {
	paddingTop: theme.spacing(4),
	width: '90%',
    },
    progress: {
	margin: theme.spacing(-0.5),
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
    commentCount: {
	color: theme.palette.tertiary.main,
	fontSize: 14,
    },
    commentCountIcon: {
	fontSize: 20,
	marginBottom: -7,
	paddingRight: theme.spacing(0.5),
	color: theme.palette.tertiary.main,
    },
    action: {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
    },
    reply: {
	fontWeight: 'bold',
	color: theme.palette.secondary.main,
	paddingRight: theme.spacing(1),
    },
});

const query = loader('../../GraphQL/Transaction.gql')

class Transaction extends Component {

    state = {
	item: '',
	price: 0,
    }

    onSubmit() {
	console.log('submitted')
    }

    createPage(node) {
	let { classes, context, id } = this.props;
	let { item, price } = this.state;

	return (
  	    <Grid container direction="column" justify="center" alignItems="center" >
	      <Grid container className={classes.content}>
		<Grid item xs={3}>
		  <div className={classes.avatarContainer}>
    		    <Avatar
			component={Link}
			prefix={1}
			to={`Person?id=${node.user.person.id}`}
  			alt="Ibis"
    			src={node.user.avatar}
    			className={classes.avatar}
		    />
		  </div>
		</Grid>
		<Grid item xs={7}>
		  <div>
		    <Typography variant="body2" className={classes.header}>
		      {`${node.user.name}`}
		      {<ToIcon className={classes.toIcon} />}
		      {`${node.target.name}`}
		    </Typography>
		  </div>
		</Grid>

		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.created}>
  		    {new Date(node.created).toDateString()}
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.gift}>
		    {`$${(node.amount/100).toFixed(2)}`}
		    {item && ` (${Math.round(node.amount/price*10)/10} ${item})`}
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={3}></Grid>
		<Grid item xs={7}>
		  <Typography variant="body2" className={classes.description}>
  		    {node.description}
		  </Typography>
		</Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={2}></Grid>
		<Grid item xs={12} className={classes.divider}>
		  <div className={classes.action}>
		    <SimpleEdgeMutation
			variant={LikeVal}
			user={context.userID}
			target={node.id}
			initial={node.hasLiked.edges.length === 1}
		    />
		  </div>
		</Grid>
		<Grid item xs={12}>
		  <CommentTree
		      showReplyRoot
		      parent={id}
		      context={context}
		      onSubmitParent={() => this.onSubmit()}
		  />
		</Grid>
	      </Grid>
	    </Grid>
	);
    }

    componentDidMount() {
	let quote, author;

	axios('https://api.tokenibis.org/ibis/price/', {
	    withCredentials: true,
	}).then(response => {
	    this.setState({ item: response.data.item, price: response.data.price });
	}).catch(error => {
	    console.log(error);
	    console.log(error.response);
	})
    };

    render() {
	let { classes, context, id } = this.props

	return (
	    <Query
		fetchPolicy="no-cache"
		query={query} 
		variables={{ id, self: context.userID }}
	    >
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
