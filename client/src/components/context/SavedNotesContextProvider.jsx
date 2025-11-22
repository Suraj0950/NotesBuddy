import {React, useState} from 'react';
const SavedNotesContext = React.createContext();

export default function SavedNotesProvider({children}) {
    const [savedNotes, setSavedNotes] = useState({});
    const [isSavedNotesLoading, setIsSavedNotesLoading] = useState(null);
    
    return (
        <SavedNotesContext.Provider value = {{
            savedNotes,
            setSavedNotes,
            isSavedNotesLoading,
            setIsSavedNotesLoading
        }}>
            {children}
        </SavedNotesContext.Provider>
    );   
};
