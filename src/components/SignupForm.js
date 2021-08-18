import { useState } from 'react';
import LoginSignupNav from './LoginSignupNav';
import PropTypes from 'prop-types';
import { Input } from '@material-ui/core';
import { InputAdornment } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email'
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

const SignupForm = ({ setLogged_in,
                      formDataIsValid,
                      errorMessage,
                      errorEnum, 
                      redirectTo, 
                      clearErrors,
                      showUserMessage }) => {
    
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handle_change = (e) => {
        const value = e.target.value;
        switch(e.target.name) {
            case "email":
                setEmail(value);
                break;
            case "username":
                setUsername(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                console.error("There was an error signing up.")
        }
    }

    const handle_signup = async (e, data) => {
        e.preventDefault(); 

        if (!formDataIsValid(data)) {
            return; 
        }

        try {
            const response = await fetch('http://localhost:8000/core/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                showUserMessage(errorEnum.ACCOUNT_CREATION_ERROR, false);
                return;
            }
            const json = await response.json(); 
            localStorage.setItem('token', json.token);
            setLogged_in(true);
            redirectTo('my-journal-entries');
        } catch(error) {
            showUserMessage(errorEnum.GENERAL_ERROR);
        }
    }

    return (
        <div className="login-signup-wrapper">
            <div className="signup-form-wrapper">
            <form 
                className="signup-form" 
                autoComplete="off"
                onSubmit={ (e) => {
                    handle_signup(e, { 
                                        email: email,
                                        username: username,
                                        password: password,
                                        confirmPassword: confirmPassword 
                                     } 
                    )}
                }
            >
                <h4>Sign Up</h4>
                <label htmlFor="username">Username</label>
                <Input 
                    className="login-signup-input"
                    startAdornment={
                        <InputAdornment position="start">
                            <PersonIcon/>
                        </InputAdornment>
                    }
                    type="text"
                    name="username"
                    value={username}
                    placeholder="username"
                    onChange={handle_change}
                    error={errorMessage === errorEnum.EMPTY_FIELDS_ERROR && username === ''}
                />
                <label htmlFor="email">Email</label>
                <Input 
                    className="login-signup-input"
                    startAdornment={
                        <InputAdornment position="start">
                            <EmailIcon/>
                        </InputAdornment>
                    }
                    type="text"
                    name="email"
                    value={email}
                    placeholder="email"
                    onChange={handle_change}
                    error={errorMessage === errorEnum.EMPTY_FIELDS_ERROR && email === ''}
                />
                <label htmlFor="password">Password</label>
                <Input className="login-signup-input"
                    startAdornment={
                    <InputAdornment position="start">
                        <LockIcon/>
                    </InputAdornment>
                    }
                    type="password"
                    name="password"
                    value={password}
                    placeholder="password"
                    onChange={handle_change}
                    error={errorMessage === errorEnum.EMPTY_FIELDS_ERROR && password === ''}
                />
                <Input className="login-signup-input"
                    startAdornment={
                    <InputAdornment position="start">
                        <LockIcon/>
                    </InputAdornment>
                    }
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="confirm password"
                    onChange={handle_change}
                    error={errorMessage === errorEnum.EMPTY_FIELDS_ERROR && confirmPassword === ''}
                />
                <input className="login-signup-button" type="submit" value="Sign Up" />
            </form>
            <LoginSignupNav isLoginForm={false} redirectTo={redirectTo} clearErrors={clearErrors}/>
        </div>
        </div>
    );
}

SignupForm.propTypes = {
    setLogged_in: PropTypes.func.isRequired,
    formDataIsValid: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    errorEnum: PropTypes.object.isRequired,
    redirectTo: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    showUserMessage: PropTypes.func.isRequired,
};

export default SignupForm