import React, { Component } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends Component {
    render() {
        const { channelName, uniqueUsers, handleSearchChange, searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props;

        return (
            <Segment clearing>
                {/** header Title */}
                <Header
                    fuid='true'
                    as='h2'
                    floated='left'
                    style={{ marginBottom: 0 }}
                >
                    <span>
                        {channelName}
                        {!isPrivateChannel &&
                            < Icon
                                name={isChannelStarred ? 'star' : 'star outline'}
                                color={isChannelStarred ? 'yellow' : 'black'}
                                onClick={handleStar} />}
                    </span>
                    <Header.Subheader>
                        {uniqueUsers}
                    </Header.Subheader>
                </Header>
                {/** header Search Input */}
                <Header floated='right'>
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size='mini'
                        icon='search'
                        name='searchTerm'
                        placeholder='Search Messages' />

                </Header>
            </Segment>
        );
    }
}

export default MessagesHeader;