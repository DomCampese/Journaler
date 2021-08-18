import { useState, useEffect } from "react";
import { Route, useRouteMatch, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import JournalEntryDetail from "./JournalEntryDetail";
import JournalEntryPreviewList from "./JournalEntryPreviewList";
import CreateJournalEntryButton from "./CreateJournalEntryButton";
import LoadingSpinner from "./LoadingSpinner";

const JournalEntryPage = ({ logged_in,
                            redirectTo, 
                            formDataIsValid, 
                            showUserMessage, 
                            errorEnum,
                            handle_logout }) => {

    const { path } = useRouteMatch();
    const [journalEntries, setJournalEntries] = useState([]);
    const [userHasJournalEntries, setUserHasJournalEntries] = useState(true);
    const [isNewJournalEntry, setIsNewJournalEntry] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch_journalEntries();
    }, [logged_in]);

/* 
 * Generic authenticated request function  
 * returns fetched data || undefined if logged out (request should never even be made if logged out)
 */
const make_authorized_api_request = async (url, method, body) => {
    try {
        setLoading(true);
        const response = await fetch(url, {
            method: method,
            headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            if (response.statusText === 'Unauthorized') {
                handle_logout();
            }
            setLoading(false);
            return;
        }
        setLoading(false);
        return await response.json();
    } catch (error) {
        setLoading(false);
        showUserMessage(errorEnum.GENERAL_ERROR);
    }
}

const fetch_journalEntries = async () => {
    if (!logged_in) return;
    const json = await make_authorized_api_request('https://journaler-django.herokuapp.com/core/journal_entries/', 'GET');
    /* Populate journal entries */
    let newJournalEntries = []
    for (const journalEntry of await json) {
        if (journalEntry) {
            newJournalEntries.push(journalEntry);
        }
    }
    setJournalEntries(newJournalEntries.reverse()); /* Reverse chronological order */
    setUserHasJournalEntries(newJournalEntries.length > 0);     
}

    const create_new_journal_entry = async () => {
        const json = await make_authorized_api_request('http://localhost:8000/core/create_journal_entry/', 'POST', { 
            date: new Date().toISOString().slice(0, 10), /* Format date for API: YYYY-MM-DD*/
            description: "Write something about your day...", 
            mood: 'good'
        });
        /* Keep journal entries state up to date */
        fetch_journalEntries();
        /* Tell the detail view that this is a new journal entry */
        setIsNewJournalEntry(true);
        /* Take user to new journal entry edit page */
        redirectTo(`my-journal-entries/${await json.id}`);
    }

    /* Format a date from the server to be more readable */
    const formatDate = (date) => {
        const parts = date.split('-');
        return new Date(parts[0], parts[1]-1, parts[2]).toDateString();
    }

    return (
        <div className="journal-entry-page-content">
            <LoadingSpinner visible={loading}/> 
            <Switch>
                <Route path={`${path}/:id`}>
                {(!loading) && (<JournalEntryDetail journalEntries={journalEntries}
                                                    redirectTo={redirectTo}
                                                    formDataIsValid={formDataIsValid}
                                                    fetch_journalEntries={fetch_journalEntries}
                                                    make_authorized_api_request={make_authorized_api_request}
                                                    showUserMessage={showUserMessage}
                                                    errorEnum={errorEnum}
                                                    setIsNewJournalEntry={setIsNewJournalEntry}
                                                    isNewJournalEntry={isNewJournalEntry}
                                                    formatDate={formatDate}
                                  />
                )}     
                   
                </Route>
                <Route path={path}>
                    {(!loading) && (
                        <>
                            <h1 className="journal-entry-preview-title">My Journal Entries</h1>    
                            <CreateJournalEntryButton create_new_journal_entry={create_new_journal_entry}></CreateJournalEntryButton>
                            <JournalEntryPreviewList journalEntries={journalEntries}
                                                     logged_in={logged_in} 
                                                     userHasJournalEntries={userHasJournalEntries}
                                                     redirectTo={redirectTo}
                                                     formatDate={formatDate}
                            />                  
                        </>
                    )}        
                </Route>  
            </Switch>
        </div>
    )
}

JournalEntryPage.propTypes = {
    logged_in: PropTypes.bool.isRequired,
    redirectTo: PropTypes.func.isRequired,
    formDataIsValid: PropTypes.func.isRequired,
    showUserMessage: PropTypes.func.isRequired,
    errorEnum: PropTypes.object.isRequired,
    handle_logout: PropTypes.func.isRequired
}

export default JournalEntryPage
