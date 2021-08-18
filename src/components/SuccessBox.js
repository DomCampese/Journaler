
import PropTypes from 'prop-types'

const SuccessBox = ({ successMessage }) => {
    return (
        <>
            <h2 className={"success-message"}>{successMessage}</h2>
        </>
    )
}

SuccessBox.propTypes = {
    successMessage: PropTypes.string.isRequired,
}


export default SuccessBox
