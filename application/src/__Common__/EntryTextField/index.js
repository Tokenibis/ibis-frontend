import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import { IbisConsumer } from '../../Context';
import { IbisUserList } from '../UserDialogList';

class EntryTextField extends Component {

    state = {
	preDialog: false,
	dialog: false,
	search: '',
	selectionStart: -1,
	mentions: [],
    };

    handleClose() {
	this.setState({ preDialog: false, dialog: false, search: '', selectionStart: -1});
    };

    handleSelect(node) {
	let { selectionStart } = this.state;
	let { id, addMention } = this.props;

	let value = document.getElementById(id).value;
	document.getElementById(id).value = value.slice(0, selectionStart
	).split('@').slice(0, -1).join('@') + '@' + node.username + value.slice(selectionStart);

	if (addMention) {
	    let mention = []
	    mention[node.username] = node.nonprofit ?
				     [node.nonprofit.id, 'nonprofit'] :
				     [node.person.id, 'person'];
	    addMention(mention);
	}

	this.setState({ preDialog: false, dialog: false, search: '', selectionStart: -1 });
    }

    entryOnKeyPress(e) {
	if (e.key === 'Enter' || /^\W$/.test(e.key)) {
	    let previous = e.target.value.slice(0, e.target.selectionStart)
	    let username = previous.split('@').slice(-1)
	    if (previous.includes('@') && /^\w+$/.test(username) && username.length < 15) {
		this.setState({
		    preDialog: true,
		    search: username,
		    selectionStart: e.target.selectionStart,
		});
	    }
	}
    };

    render() {
	let { id, setMention, onChange, ...other } = this.props;
	let { preDialog, dialog, search } = this.state;

	return (
	    <div>
	      <Dialog
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
		  onKeyPress={(e) => this.entryOnKeyPress(e)}
		  onChange={() => {this.setState({ dialog: preDialog }); onChange && onChange()}}
	      {...other}
	      />
	    </div>
	);
    };
};

export default EntryTextField;
