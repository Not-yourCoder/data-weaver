import { setSearchActive } from '@/store/features/searchSlice'
import axios, { AxiosResponse } from 'axios'
import { error } from 'console'
import { SearchIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSearchResults } from './query-hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Props = {
    className: string
    activeTab: { id: number, label: string }
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    setGraphData: (c: any) => void
}

const SearchBox = ({ className, activeTab, searchTerm, setSearchTerm, setGraphData }: Props) => {
    const [errorWhileSearch, setErrorWhileSearch] = useState("")

    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleFocus = () => {
        dispatch(setSearchActive(true));
    };

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: fetchSearchResults,
        onSuccess: async (data) => {
            console.log("data");
            setGraphData(data);
            setErrorWhileSearch(null);
        },
        onError: (error) => {
            console.log("Error:", error.message);
            setErrorWhileSearch(error?.message || "An unknown error occurred");
        }
    });
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setErrorWhileSearch("Search term cannot be empty");
            return;
        }
        mutate( searchTerm, activeTab.label );
    };
    // useEffect(() => {
    //     const handleClickOutside = (e: MouseEvent) => {
    //         if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
    //             dispatch(setSearchActive(false));
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [dispatch]);


   
    return (
        <div className={`${className} bg-white rounded-md`}>
            <div className='flex items-center gap-2'>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search Node or Relationship'
                    className='w-full rounded-md p-3'
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setErrorWhileSearch("")}}
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
            {isError &&
                <p className='bg-transparent'>Error: {errorWhileSearch}</p>
            }
            {isLoading &&
                <p className=''>Loading</p>
            }
        </div>
    );
};

export default SearchBox;
