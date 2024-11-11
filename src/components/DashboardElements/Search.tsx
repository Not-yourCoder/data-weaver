import axios from 'axios'
import { SearchIcon } from 'lucide-react'
import { SetStateAction, useEffect, useState } from 'react'

type Props = {
    className: string
    setHighlightLinks: (a: any) => void
    setHighlightNodes: (b: any) => void
    setGraphData: (c: any) => void
}

const Search = ({ className, setHighlightLinks, setGraphData, setHighlightNodes }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm !== null && searchTerm.length > 1) {
                try {
                    const response = await axios.get(`/api/search-suggestions?q=${searchTerm}`);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    console.log("suggestions", suggestions)
    const handleSearch = async () => {
        console.log(searchTerm)
        try {
            const response = await axios.post("http://localhost:6969/api/search-query", { query: searchTerm })
            const { node, relationship } = response.data
            if (node) {
                setHighlightLinks(relationship)
                setHighlightNodes(node)
                setGraphData(response.data)
                console.log("Search response", response.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setSearchTerm(suggestion);
        handleSearch(); // Initiate search immediately on suggestion click
    };
    return (
        <div className={`${className} bg-white`}>
            <div className='flex items-center gap-2 '>
                <input type="text" placeholder='Search Node or Relationship' className='w-full p-2' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <SearchIcon className='w-10 aspect-square hover:cursor-pointer' onClick={handleSearch} />
            </div>
            {/* {suggestions.length > 0 && (
                <ul className="suggestions-box">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => setSearchTerm(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )} */}
        </div>
    )
}

export default Search