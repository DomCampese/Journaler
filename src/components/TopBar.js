import PropTypes from 'prop-types';
import Logo from '@material-ui/icons/ImportContactsOutlined';


const TopBar = ({ logged_in, handle_logout }) => {

    return (
        <div className="topbar">
            <div className="topbar-content">
                <div className="topbar-title">
                    <Logo></Logo>
                    <h1>Journaler</h1>
                </div>
                <div className="topbar-logout-button-wrapper">
                    {logged_in && <button className="topbar-logout-button" onClick={handle_logout}>Log out</button>}
                </div>
            </div>
        </div>
    );
}

TopBar.propTypes = {
    logged_in: PropTypes.bool.isRequired,
    handle_logout: PropTypes.func.isRequired,
};

export default TopBar;