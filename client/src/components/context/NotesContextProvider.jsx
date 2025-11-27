import React, {useState} from 'react';
const NotesContext  = React.createContext();

export default function NotesContextProvider({children}) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDocSS, setLastDocSS] = useState(null);
    const [currentFilters, setCurentFilters] = useState({});
    const [totalNotesCount, setTotalNotesCount] = useState(0);
    const [filterOptions, setFilterOptions] = useState({
        semesters: [],
        subjects: [],
        modules: [],
    });

    return (
        <NotesContext.Provider value = {{
            notes,
            setNotes,
            loading,
            setLoading,
            loadingMore,
            setLoadingMore,
            hasMore,
            setHasMore,
            lastDocSS,
            setLastDocSS,
            currentFilters, 
            setCurentFilters,
            totalNotesCount,
            setTotalNotesCount,
            filterOptions,
            setFilterOptions
        }}>
            {children}
        </NotesContext.Provider>
    );
};
