import { setSearchActive } from '@/store/features/searchSlice'
import { SearchIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSearchResults } from './query-hooks'
import { useMutation } from '@tanstack/react-query'

type Props = {
    className: string
    activeTab: { id: number, label: string }
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
    setGraphData: (c: any) => void
    setGraphLoading: any
}

const SearchBox = ({ className, activeTab, searchTerm, setSearchTerm, setGraphData, setGraphLoading }: Props) => {
    const [errorWhileSearch, setErrorWhileSearch] = useState("")
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleFocus = () => {
        dispatch(setSearchActive(true));
    };

    const { mutate, isError } = useMutation({
        mutationFn: fetchSearchResults,
        onMutate: () => {
            setGraphLoading(true);
        },
        onSuccess: async (data) => {
            setGraphData(data);
            setGraphLoading(false)
            setErrorWhileSearch(null);
            dispatch(setSearchActive(false))
        },
        onError: (error) => {
            console.log("Error:", error.message);
            setErrorWhileSearch(error?.message || "An unknown error occurred");
            setGraphLoading(false)
        }
    });

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setErrorWhileSearch("Search term cannot be empty");
            return;
        }

        mutate({ searchTerm, label: activeTab.label });
    };



    return (
        <div className={`${className} bg-white rounded-md`}>
            <div className='flex items-center gap-2'>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search Node or Relationship'
                    className='w-full rounded-md p-3 focus:outline-none'
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setErrorWhileSearch("") }}
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
                <p className=' mx-auto w-full text-red-600 p-2 mt-2'>{errorWhileSearch}</p>
            }
        </div>
    );
};

export default SearchBox;
