
import PropTypes from "prop-types";

const ConfirmDialog = ({ message, onConfirm, onDeny }) => {
    return (
        <div className="confirm-dialog-wrapper">
            <div className="confirm-dialog-content">
                <p className="confirm-dialog-message">{message}</p>
                <button className="confirm-dialog-confirm-button" onClick={onConfirm}>Yes</button>
                <button className="confirm-dialog-deny-button" onClick={onDeny}>Cancel</button>
            </div>
        </div>
       
    )
}

ConfirmDialog.propTypes = {
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
}

export default ConfirmDialog
