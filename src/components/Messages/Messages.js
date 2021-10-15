import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import firebase from '../../firebase';
import Message from './Message';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';


class Messages extends Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        loading: true,
        progressBar: false
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        const loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                loading: false
            })
        });
    }
    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user} />
        ))
    );

    isProgressBarVissible = precent => {
        if (precent > 0) {
            this.setState({ progressBar: true })
        }
    }

    render() {
        const { messagesRef, channel, user, messages, loading, progressBar } = this.state;
        return (
            <Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {!loading && this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVissible={this.isProgressBarVissible} />
            </Fragment>
        );
    }
}

export default Messages;