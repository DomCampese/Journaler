
import PropTypes from "prop-types";
import ErrorBox from './ErrorBox';
import SuccessBox from './SuccessBox';

const MessageBox = ({ successMessage, errorMessage }) => {
    return (
        <div>
            { errorMessage && <ErrorBox errorMessage={errorMessage}></ErrorBox> }
            { successMessage && <SuccessBox successMessage={successMessage}></SuccessBox> } 
        </div>
    )
}

MessageBox.propTypes = {
    successMessage: PropTypes.string.isRequired,
    errorMessage: PropTypes.string.isRequired,
}

export default MessageBox
