
import PropTypes from 'prop-types'

const ErrorBox = ({ errorMessage }) => {
    return (
        <>
            <h2 className={"error-message"}>{errorMessage}</h2>
        </>
    )
}

ErrorBox.propTypes = {
    errorMessage: PropTypes.string.isRequired,
}

export default ErrorBox
