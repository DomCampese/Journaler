import PropTypes from 'prop-types'
 
const LoginSignupNav = ({ isLoginForm, redirectTo, clearErrors}) => {

    const handle_click = () => {
        if (isLoginForm) {
            redirectTo('/signup')
        } else {
            redirectTo('/login')
        }
        clearErrors();
    }

    return (  
        <div className="login-signup-nav-wrapper"> 
            {isLoginForm ? (
                <><span>Don't have an account?</span>
                <button className = "login-signup-nav-button" onClick={handle_click}>
                    Sign up
                </button></>
            ) : (
                <><span>Already have an account?</span>
                <button className = "login-signup-nav-button" onClick={handle_click}>
                    Login
                </button></>
            )}
        </div>
    )
}

LoginSignupNav.propTypes = {
   isLoginForm: PropTypes.bool.isRequired,
   redirectTo: PropTypes.func.isRequired,
   clearErrors: PropTypes.func.isRequired
};

export default LoginSignupNav