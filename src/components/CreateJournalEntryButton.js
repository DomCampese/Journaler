
import PropTypes from "prop-types";
import AddIcon from '@material-ui/icons/Add';

const CreateJournalEntryButton = ({ create_new_journal_entry }) => {
    return (
        <div className="new-journal-entry-button-wrapper">
            <button className="new-journal-entry-button" onClick={create_new_journal_entry}>
                <div className="new-journal-entry-button-inner-wrapper">
                    <p>Create</p>
                    <AddIcon></AddIcon>
                </div>
            </button>
        </div>  
    )
}

CreateJournalEntryButton.propTypes = {
    create_new_journal_entry: PropTypes.func.isRequired,
}

export default CreateJournalEntryButton
