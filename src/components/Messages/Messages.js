import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase from '../../firebase';
import Message from './Message';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import { setUserPosts } from '../../actions';


class Messages extends Component {
    state = {
        isChannelStarred: false,
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        usersRef: firebase.database().ref('users'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        loading: true,
        progressBar: false,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListeners(channel.id);
            this.addUserStarListners(channel.id, user.uid)
        }
    }

    addUserStarListners = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred });
                }
            })


    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        const loadedMessages = [];
        const ref = this.getMessagesRef();

        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                loading: false
            })
            this.countUniqueUsers(loadedMessages);
            this.countUsersPosts(loadedMessages);
        });
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;

        return privateChannel ? privateMessagesRef : messagesRef;
    }

    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        if (this.state.isChannelStarred) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name: this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name: this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                })
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if (err !== null) {
                        console.log(err);
                    }
                });
        }
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length === 1 ? 'User' : 'Users'
        const numUniqueUsers = `${uniqueUsers.length} ${plural}`;
        this.setState({ numUniqueUsers });

    }

    countUsersPosts = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count++;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {})
        this.props.setUserPosts(userPosts);
    }

    disPlayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
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

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages())
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, [])
        this.setState({ searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 1000)
    }

    render() {
        const { messagesRef, channel, user, messages, searchTerm, progressBar, numUniqueUsers, searchResults, searchLoading, privateChannel, isChannelStarred } = this.state;
        return (
            <Fragment>
                <MessagesHeader
                    channelName={this.disPlayChannelName(channel)}
                    uniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred} />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    messagesRef={messagesRef}
                    currentChannel={channel}
                    currentUser={user}
                    isProgressBarVissible={this.isProgressBarVissible}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef} />
            </Fragment>
        );
    }
}

export default connect(null, { setUserPosts })(Messages);