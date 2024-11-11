import SearchBox from '@/modules/search/SearchBox'
import SearchOptionsPanel from '@/modules/search/SearchOptionsPanel'
import { RootState } from '@/store/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'


const Search = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const searchActive = useSelector((state: RootState) => state.search.searchActive);
    console.log("Search Active", searchActive)
    return (
        <div className='absolute left-[35%] z-50 w-[35rem] rounded flex flex-col gap-2'>
            <SearchBox className='w-full' searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {searchActive &&
                <SearchOptionsPanel searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
        </div>

    )
}

export default Search