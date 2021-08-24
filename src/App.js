import { useState, useEffect } from 'react';
import { Switch, Route, useHistory, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import MessageBox from './components/MessageBox';
import Footer from './components/Footer';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import ScrollToTop from './components/ScrollToTop';
import './styles/App.css'
import JournalEntryPage from './components/JournalEntryPage';
import PageNotFound from './components/PageNotFound';

const App = () => {
    const [logged_in, setLogged_in] = useState(localStorage.getItem('token') ? true : false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const location = useLocation();
    const history = useHistory(logged_in ? '/my-journal-entries' : 'login');

    useEffect(() => {
        /* Redirect to login when an unauthenticated user attempts to visit a secure page */
        const public_pages = ['/login', '/signup', '/page-not-found'];
        if (!logged_in && !public_pages.includes(location.pathname)) {
            redirectTo('/login');
        }

        /* domain.com should never send a 404, so send user to an appropriate page */
        if (location.pathname === '/') {
            redirectTo(logged_in ? '/my-journal-entries' : '/login');
        }
    }, [location]);

    /* Maps the name for common error messages (to avoid string hardcoding) */
    const errorEnum = {
        USERNAME_OR_PASSWORD_ERROR: 'Incorrect Username or Password.',
        EMPTY_FIELDS_ERROR: 'Please fill out all fields.',
        ACCOUNT_CREATION_ERROR: 'There was an issue creating your account. Please try again.',
        PASSWORD_MATCH_ERROR: 'Passwords do not match.',
        GENERAL_ERROR: 'Oops! Something went wrong on our end.'
    }

    const handle_logout = () => {
        localStorage.removeItem('token');
        setLogged_in(false);
        redirectTo('/login');
    }
    
    const formDataIsValid = (data) => {
        /* Return false when any fields are empty */
        for (let key in data) {
            if ((!data[key])) {
                showUserMessage(errorEnum.EMPTY_FIELDS_ERROR, false);
                return false; 
            }
        }
        /* Make sure passowrds match if there are two */
        if (data.confirmPassword && !(data.password === data.confirmPassword)) {
            showUserMessage(errorEnum.PASSWORD_MATCH_ERROR, false);
            return false; 
        }
        return true; 
    }

    const showUserMessage = async (message, isSuccess) => {
        const delayedAction = (action, seconds) => {
            setTimeout(action, (seconds * 1000));
        }

        /* Show message for five seconds */
        if (isSuccess) {
            setErrorMessage('');
            setSuccessMessage(message);
            delayedAction(() => setSuccessMessage(''), 5);
        } else {
            setSuccessMessage('');
            setErrorMessage(message);
            delayedAction(() => setErrorMessage('') , 5);
        }
    }

    const redirectTo = (path) => {
        history.push(path);
        clearErrors();
    }

    const clearErrors = () => {
        setErrorMessage('');
    }

    return (
        <div className="App">
            <TopBar logged_in={logged_in} handle_logout={handle_logout}/>
            <Footer/>
            <div className="content-wrapper">
            <MessageBox errorMessage={errorMessage} successMessage={successMessage}/>
                <ScrollToTop />
                <Switch>
                    <Route path='/login'> 
                        <LoginForm  
                            setLogged_in={setLogged_in}
                            errorMessage={errorMessage} 
                            showUserMessage={showUserMessage}
                            errorEnum={errorEnum}
                            redirectTo={redirectTo}
                            clearErrors={clearErrors}
                            formDataIsValid={formDataIsValid}
                        />    
                    </Route>
                    <Route path='/signup'>
                        <SignupForm 
                            setLogged_in={setLogged_in}
                            errorMessage={errorMessage} 
                            showUserMessage={showUserMessage}
                            errorEnum={errorEnum}
                            redirectTo={redirectTo}
                            clearErrors={clearErrors}
                            formDataIsValid={formDataIsValid}
                        />
                    </Route>
                    <Route path='/my-journal-entries' >      
                        <JournalEntryPage logged_in={logged_in}
                                          redirectTo={redirectTo}   
                                          formDataIsValid={formDataIsValid}   
                                          showUserMessage={showUserMessage}
                                          errorEnum={errorEnum}
                                          handle_logout={handle_logout}
                        />
                    </Route>
                    <Route>
                        <PageNotFound></PageNotFound>
                    </Route>
                </Switch>
            </div>
        </div>   
    );
}

export default App;
