import JournalEntryPreview from "./JournalEntryPreview"
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';


/* Display all journal entries */
const JournalEntryPreviewList = ({ journalEntries, logged_in, userHasJournalEntries, formatDate }) => {

    return (
        <div className="journal-entry-preview-list">
            {  (userHasJournalEntries) ? (
                    journalEntries.map((journalEntry) => (
                        <JournalEntryPreview key={journalEntry.id}
                                             journalEntry={journalEntry}
                                             logged_in={logged_in}
                                             formatDate={formatDate}
                        />
                    ))
                ) : (
                    <div className="create-journal-entry-prompt-wrapper">
                        <ArrowUpwardIcon fontSize="large"></ArrowUpwardIcon>
                        <p className="create-journal-entry-prompt">Create your first journal entry!</p>
                    </div>
                )
            }
        </div>
    )
}

JournalEntryPreviewList.propTypes = {
    journalEntries: PropTypes.array.isRequired,
    logged_in: PropTypes.bool.isRequired,
    userHasJournalEntries: PropTypes.bool.isRequired,
    formatDate: PropTypes.func.isRequired,
}

export default JournalEntryPreviewList
