import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom" 
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ConfirmDialog from "./ConfirmDialog";
import good_mood_face from "../images/good_mood_face.png";
import okay_mood_face from "../images/okay_mood_face.png";
import bad_mood_face from "../images/bad_mood_face.png";

const JournalEntryDetail = ({ journalEntries,
                              redirectTo,
                              formDataIsValid,
                              fetch_journalEntries,
                              make_authorized_api_request,
                              showUserMessage,
                              errorEnum,
                              isNewJournalEntry,
                              setIsNewJournalEntry,
                              formatDate }) => {

    const params = useParams();
    const getJournalEntryFromId = () => {
        /* Return the first (and only) journal entry with id from the url */
        return ( journalEntries.filter((j) => parseInt(j.id) === parseInt(params.id)) )[0];
    }
    const [journalEntry, setJournalEntry] = useState(getJournalEntryFromId());
    const [id, setId] = useState(params.id);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [mood, setMood] = useState('');   
    const [save, setSave] = useState(true); /* Toggles control flow of form submit */
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        setJournalEntry(getJournalEntryFromId());
    }, [journalEntries]);

    useEffect(() => {
        /* Once journal entry is not undefined (loading), initialize form data */
        if (journalEntry) {
            setDate(journalEntry.date);
            setDescription(journalEntry.description);
            setMood(journalEntry.mood);
        }
    }, [journalEntry]);

    const moodEnum = {
        GOOD: 'good',
        OKAY: 'okay',
        BAD: 'bad'
    } 

    const handle_mood_button_click = (e) => {
        e.preventDefault();
        setMood(e.target.value);
    }

    const handle_description_change = (e) => {
        setDescription(e.target.value);
        setIsNewJournalEntry(false);
    }

    const handle_save_button_click = () => {
        setSave(true);
    }

    const handle_delete_button_click = () => {
        setSave(false);
    }

    const handle_go_back_button_click = (e) => {
        /* Going back before editing the new journal entry should trigger a delete prompt */
        e.preventDefault();
        if (isNewJournalEntry) {
            setShowConfirmDialog(true);
            return;
        }
        redirectTo('/my-journal-entries');
    }

    const handle_save = async (e, data) => {
        if (isNewJournalEntry) {
            showUserMessage(errorEnum.EMPTY_FIELDS_ERROR, false);
            return;
        }
        if (!formDataIsValid(data)) {
            return;
        }
        await make_authorized_api_request(`https://journaler-django.herokuapp.com:8000/core/update_journal_entry/${id}/`, 'PUT', {
            date, description, mood, id 
        });
        showUserMessage("Journal Entry Saved", true);
        /* Refetch the journal entries */
        fetch_journalEntries();
    }

    const handle_confirm_dialog_confirm = () => {
        handle_delete();
        setShowConfirmDialog(false);
    }

    const handle_confirm_dialog_deny = () => {
        setShowConfirmDialog(false);
    }

    const handle_submit = (e) => {
        e.preventDefault();
        if (save) {
            handle_save(e, {date, description, mood});
        } else {
            /* User has to confirm a delete */
            setShowConfirmDialog(true);
        }
    }

    const handle_delete = async (e) => {
        await make_authorized_api_request(`https://journaler-django.herokuapp.com/core/delete_journal_entry/${id}/`, 'DELETE');
        showUserMessage("Journal Entry Deleted", true);
        fetch_journalEntries();
        setIsNewJournalEntry(false);
        /* Detail page no longer exists */
        redirectTo('/my-journal-entries');
    }

    return (
        <div className="journal-entry-detail-wrapper">
            { showConfirmDialog && <ConfirmDialog message={"Delete this journal entry?"}
                                                  onConfirm={handle_confirm_dialog_confirm}
                                                  onDeny={handle_confirm_dialog_deny}
                                   />
            }
            {journalEntry && (
                <form className="journal-entry-detail-form" onSubmit={handle_submit}>             
                    <button className="go-back-button" onClick={handle_go_back_button_click}>
                        <div className="go-back-button-content">
                            <ArrowBackIcon fontSize="inherit"/> <span>Back</span>
                        </div>
                    </button>           
                    <label className="journal-entry-detail-label">{formatDate(journalEntry.date)}</label>
                    <textarea className="journal-entry-detail-textarea" 
                              value={(isNewJournalEntry) ? "" : description}
                              placeholder={(isNewJournalEntry) ? description : ""}
                              onChange={handle_description_change}
                    >
                    </textarea>
                    <div className="mood-buttons-wrapper">
                        <input  className={(mood === moodEnum.GOOD) ? "mood-button-selected" : "good-mood-button"}
                                type="image"
                                src={good_mood_face}
                                alt="happy face"
                                value={moodEnum.GOOD}
                                onClick={handle_mood_button_click}
                        />
                        <input  className={(mood === moodEnum.OKAY) ? "mood-button-selected" : "okay-mood-button"}
                                type="image"
                                src={okay_mood_face}
                                alt="neutral face"
                                value={moodEnum.OKAY}
                                onClick={handle_mood_button_click}
                        />
                        <input  className={(mood === moodEnum.BAD) ? "mood-button-selected" : "bad-mood-button"}
                                type="image"
                                src={bad_mood_face}
                                alt="sad face"
                                value={moodEnum.BAD}
                                onClick={handle_mood_button_click}
                        />
                    </div>
                    <div>
                        <input className="journal-entry-detail-save-button" type="submit" value="Save" onClick={handle_save_button_click}/>
                        <input className="journal-entry-detail-delete-button" type="submit" value="Delete" onClick={handle_delete_button_click}/>  
                    </div>
                </form>
            )} 
        </div>
    )
}

JournalEntryDetail.propTypes = {
    journalEntries: PropTypes.array.isRequired,
    redirectTo: PropTypes.func.isRequired,
    formDataIsValid: PropTypes.func.isRequired,
    fetch_journalEntries: PropTypes.func.isRequired,
    make_authorized_api_request: PropTypes.func.isRequired,
    showUserMessage: PropTypes.func.isRequired,
    errorEnum: PropTypes.object.isRequired,
    isNewJournalEntry: PropTypes.bool.isRequired,
    setIsNewJournalEntry: PropTypes.func.isRequired,
    formatDate: PropTypes.func.isRequired,
}

export default JournalEntryDetail
