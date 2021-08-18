import { useState } from 'react';
import LoginSignupNav from './LoginSignupNav';
import PropTypes from 'prop-types';
import { Input } from '@material-ui/core';
import { InputAdornment } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';

const LoginForm = ({ errorMessage,
                     setLogged_in,
                     errorEnum,
                     redirectTo,
                     clearErrors,
                     formDataIsValid,
                     showUserMessage }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handle_change = (e) => {
        const value = e.target.value;
        switch(e.target.name) {
            case "username":
                setUsername(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
        }
    }

    const handle_login = async (e, data) => {
        e.preventDefault();

        if (!formDataIsValid(data)) {
            return; 
        }  
        
        try {
            /* Send username and password, recieve and store JWT */
            const response = await fetch('http://localhost:8000/token-auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                console.log(response.error)
                showUserMessage(errorEnum.USERNAME_OR_PASSWORD_ERROR, false);
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
            <div className="login-form-wrapper">
                <h4>Login</h4>
                <form 
                    className="login-form" 
                    onSubmit={(e) => {
                        handle_login(e, {username: username, password: password})}
                    }
                >
                    <label htmlFor="username">Username</label>
                    <Input className="login-signup-input"
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
                        error={errorMessage === errorEnum.EMPTY_FIELDS_ERROR && username.length === 0}
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
                    <input className="login-signup-button" type="submit" value="Login"/>
                </form>
                <LoginSignupNav isLoginForm={true} redirectTo={redirectTo} clearErrors={clearErrors}/>
            </div>
        </div>
    );
}

LoginForm.propTypes = {
    setLogged_in: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    errorEnum: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    formDataIsValid: PropTypes.func.isRequired,
    showUserMessage: PropTypes.func.isRequired,
};

export default LoginForm