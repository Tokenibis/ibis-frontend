import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import { IbisConsumer } from '../../Context';
import { IbisUserList } from '../UserDialogList';

const styles = theme => ({
    dialogPaper: {
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
	width: '70%',
    },
});


class EntryTextField extends Component {

    state = {
	dialog: false,
	search: '',
	selectionStart: -1,
	mentions: [],
    };

    handleClose() {
	this.setState({ dialog: false, search: '', selectionStart: -1});
    };

    handleSelect(node) {
	let { selectionStart } = this.state;
	let { id, addMention } = this.props;

	let value = document.getElementById(id).value;
	let index = value.slice(0, selectionStart).split('@').slice(0, -1).join('@').length;

	document.getElementById(id).value = value.slice(0, index) + '@' + node.username + value.slice(selectionStart);

	document.getElementById(id).selectionStart = index + 1 + node.username.length + 1;
	document.getElementById(id).selectionEnd = document.getElementById(id).selectionStart;

	if (addMention) {
	    let mention = []
	    mention[node.username] = node.organization ?
				     [node.organization.id, 'organization'] :
				     [node.person.id, 'person'];
	    addMention(mention);
	}

	this.setState({ dialog: false, search: '', selectionStart: -1 });
    }

    entryOnKeyPress(e) {
	let { onChange } = this.props;

	let key = e.target.value[e.target.selectionStart - 1]
	if (key === 'Enter' || /^\W$/.test(key)) {
	    let previous = e.target.value.slice(0, e.target.selectionStart)
	    let username = ` ${previous}`.split(/\W@/).slice(-1)[0].slice(0, -1)
	    if (/^\w+$/.test(username) && username.length < 15) {
		this.setState({
		    dialog: true,
		    search: username,
		    selectionStart: e.target.selectionStart - 1,
		});
	    }
	}
	onChange(e);
    };

    render() {
	let { id, setMention, onChange, classes, ...other } = this.props;
	let { dialog, search } = this.state;

	return (
	    <div>
	      <Dialog
		  PaperProps={{ className: classes.dialogPaper }}
		  open={dialog}
		  onClose={(e) => this.handleClose()}
	      >
		<IbisConsumer>
		  {context => (
		      <IbisUserList
			  context={context}
			  filterValue={`_Search:${search}`}
		          onClick={(node) => this.handleSelect(node)}
		      />
		  )}
		</IbisConsumer>
	      </Dialog>
	      <TextField
		  id={id}
		  onChange={(e) => this.entryOnKeyPress(e)}
	          classes={classes}
	      {...other}
	      />
	    </div>
	);
    };
};

export default withStyles(styles)(EntryTextField);
