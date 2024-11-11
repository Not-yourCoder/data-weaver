import { setSearchActive } from '@/store/features/searchSlice'
import axios from 'axios'
import { SearchIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
    className: string
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    setGraphData: (c: any) => void
}

const SearchBox = ({ className, searchTerm, setSearchTerm, setGraphData }: Props) => {
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
        dispatch(setSearchActive(true));
    };

    const handleSearch = async () => {
        console.log(searchTerm);
        try {
            const response = await axios.post("http://localhost:6969/api/search-query", { query: searchTerm });
            const { node, relationship } = response.data;
            if (response) {
                setGraphData(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                dispatch(setSearchActive(false));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dispatch]);

    return (
        <div className={`${className} bg-white rounded-md`}>
            <div className='flex items-center gap-2'>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search Node or Relationship'
                    className='w-full rounded-md p-3'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={handleFocus}
                />
                <SearchIcon
                    className='w-12 aspect-square hover:cursor-pointer'
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSearch();
                    }}
                />
            </div>
        </div>
    );
};

export default SearchBox;
