import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import goodMoodFace from '../images/good_mood_face.png'
import okayMoodFace from '../images/okay_mood_face.png'
import badMoodFace from '../images/bad_mood_face.png'
/* 
    Display the preview of the journal_entry prop
    A journal entry contains the following fields: 
 */
const JournalEntryPreview = ({ journalEntry, formatDate }) => {
    const [descriptionPreview, setDescriptionPreview] = useState('');
    const { path } = useRouteMatch();
    const [mood, setMood] = useState(journalEntry && journalEntry.mood);
    const linkStyle = {
        textDecoration: "none",
        color: "black",
    };
    const imageMap = {
        'good': goodMoodFace,
        'okay': okayMoodFace,
        'bad': badMoodFace
    }

    useState(() => {
        setMood(journalEntry?.mood); /* Optional chaining */
    }, [journalEntry])

    useState(() => {
        let newDescriptionPreview = journalEntry?.description;
        if (newDescriptionPreview?.length >= 200) {
            newDescriptionPreview = newDescriptionPreview?.slice(0, 201) + "...";
        }
        setDescriptionPreview(newDescriptionPreview);
    }, [journalEntry]);

    return (
        <div className="journal-entry-preview" >
            { journalEntry && (
                <Link to={`${path}/${journalEntry.id}`} style={linkStyle}>
                    <h2 className="journal-entry-preview-label">Date </h2>
                    <p className="journal-entry-preview-text">{formatDate(journalEntry.date)}</p>
                    <h2 className="journal-entry-preview-label">Description </h2>
                    <p className="journal-entry-preview-text">{descriptionPreview}</p>
                    <h2 className="journal-entry-preview-label">Mood </h2>
                    <div>
                        <img className="mood-image" src={imageMap[mood]} alt={`${mood} face icon`}></img>
                    </div>
                    
                </Link>
            )}
        </div>
    )
}

JournalEntryPreview.propTypes = {
    journalEntry: PropTypes.object.isRequired,
    formatDate: PropTypes.func.isRequired,
};

export default JournalEntryPreview
