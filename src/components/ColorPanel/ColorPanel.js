import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import firebase from '../../firebase';
import { setColors } from '../../actions';


class ColorPanel extends Component {
    state = {
        user: this.props.currentUser,
        modal: false,
        primary: '#4c3c4c',
        secondary: '#eee',
        usersRef: firebase.database().ref('users'),
        userColors: []
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListner(this.state.user.uid);
        }
    }

    addListner = userId => {
        let userColors = [];
        this.state.usersRef
            .child(`${userId}/colors`)
            .on('child_added', snap => {
                userColors.unshift(snap.val());
                console.log(userColors)
                this.setState({ userColors })
            })
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleChangePrimary = color => this.setState({ primary: color.hex });

    handleChangeSecondary = color => this.setState({ secondary: color.hex });

    handleSaveColors = () => {
        if (this.state.primary && this.state.secondary) {
            this.saveColors(this.state.primary, this.state.secondary);
        }
    }

    saveColors = (primaryColor, secondaryColor) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primaryColor,
                secondaryColor
            })
            .then(() => {
                console.log('Colors added');
                this.closeModal();
            })
            .catch(err => {
                console.log(err);
            });
    }

    displayUserColors = colors => (
        colors.length > 0 && colors.map((color, i) => (
            <Fragment key={i}>
                <Divider />

                <div
                    className='color__container'
                    onClick={() => this.props.setColors(color.primaryColor, color.secondaryColor)}>
                    <div className='color__square' style={{ background: color.primaryColor }}>
                        <div className='color__overlay' style={{ background: color.secondaryColor }}>

                        </div>
                    </div>
                </div>
            </Fragment>
        ))
    )

    render() {
        const { modal, primary, secondary, userColors } = this.state
        return (
            <Sidebar
                as={Menu}
                icon='labeled'
                inverted
                vertical
                visible
                width='very thin'
            >
                <Divider />
                <Button
                    icon='add'
                    size='small'
                    color='blue'
                    onClick={this.openModal} />
                {this.displayUserColors(userColors)}

                {/** Color picker modal */}
                <Modal
                    basic
                    open={modal}
                    onClose={this.closeModal} >
                    <Modal.Header>
                        Choose App Colors
                    </Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label
                                content='Primary Color' />
                            <SliderPicker
                                color={primary}
                                onChange={this.handleChangePrimary} />
                        </Segment>
                        <Segment inverted>
                            <Label content='Secondary Color' />
                            <SliderPicker
                                color={secondary}
                                onChange={this.handleChangeSecondary} />
                        </Segment>

                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color='green'
                            inverted
                            onClick={this.handleSaveColors}  >
                            <Icon name='checkmark' /> Save Colors

                        </Button>
                        <Button
                            color='red'
                            inverted
                            onClick={this.closeModal}  >
                            <Icon name='remove' /> Cancel

                        </Button>
                    </Modal.Actions>
                </Modal>
            </ Sidebar>
        );
    }
}

export default connect(null, { setColors })(ColorPanel);