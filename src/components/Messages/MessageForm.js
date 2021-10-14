import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const { user } = this.state
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                avatar: user.photoURL,
            },
            content: this.state.message
        }
        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel, errors } = this.state;

        if (message) {
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', error: [] })
                })
                .catch(err => {
                    console.log(err)
                    this.setState({
                        loading: false,
                        errors: [...errors, err],
                    })
                })

        } else {
            const errMessage = {
                message: 'Add a message'
            }
            this.setState({
                errors: [...errors, errMessage]
            });
        }
    }

    render() {
        const { errors, message, loading } = this.state
        return (
            <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    value={message}
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                    placeHolder='Write your message' />

                <Button.Group icon widths='2'>
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading}
                        color='orange'
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                    />
                    <Button
                        color='teal'
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;