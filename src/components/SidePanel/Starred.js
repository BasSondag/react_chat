import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";

import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon } from 'semantic-ui-react';


class Starred extends Component {
    state = {
        starredChannels: [],
        activeChannel: '',
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListners(this.state.user.uid)
        }

    }

    addListners = userId => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChanged = {
                    id: snap.key,
                    ...snap.val()
                };
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChanged]
                })
            })

        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = {
                    id: snap.key,
                    ...snap.val()
                }
                const filterdChannels = this.state.starredChannels.filter(channel => {
                    return channel.id !== channelToRemove.id;
                })
                this.setState({ starredChannels: filterdChannels });
            })
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        // this.clearNotifications();
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel })
    }

    displayChannels = starredChannels => starredChannels.length > 0 && starredChannels.map(channel => (
        <Menu.Item
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{ opacity: 0.7 }}
            active={channel.id === this.state.activeChannel}
        >
            # {channel.name}
        </Menu.Item >

    ));


    render() {
        const { starredChannels } = this.state;
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star' /> STARRED
                    </span>{' '}
                    ({starredChannels.length})
                </Menu.Item>
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setPrivateChannel, setCurrentChannel })(Starred);