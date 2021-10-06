import React from 'react';
import { Grid, Form, Segment, Button, Message, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';


class Login extends React.Component {
    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loadin: true });
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser, 'the signedInUser');
                    this.setState({ loading: false });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                })
        }
    }

    isFormValid = ({ email, password }) => email && password;

    handleInputError = (errors, inputName) => {
        return errors.some(
            error => error.message.toLowerCase().includes(inputName)
        ) ? 'error' : '';
    }

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 450 }} >
                    <Header as='h1' icon color='violet' textAlign='center'>
                        <Icon name='code branch' color='violet' />
                        Login to DevChat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                        <Segment stacked>

                            <Form.Input
                                className={this.handleInputError(errors, 'email')}
                                fluid name='email'
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email Address'
                                onChange={this.handleChange}
                                value={email}
                                type='email' />

                            <Form.Input
                                className={this.handleInputError(errors, 'password')}
                                fluid name='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                onChange={this.handleChange}
                                value={password}
                                type='password' />

                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color='violet'
                                fluid
                                size='large'>Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}

                    <Message>
                        Don't  have a account? <Link to='/register'>register</Link>
                    </Message>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Login;