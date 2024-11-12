import SearchBox from '@/modules/search/SearchBox'
import SearchOptionsPanel from '@/modules/search/SearchOptionsPanel'
import { RootState } from '@/store/store'
import { useState } from 'react'
import { useSelector } from 'react-redux'


const Search = ({ setGraphData }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState({ id: 1, label: "Nodes" })
    const searchActive = useSelector((state: RootState) => state.search.searchActive);
    return (
        <div className='absolute left-[35%] z-50 w-[35rem] rounded flex flex-col gap-2'>
            <SearchBox className='w-full' searchTerm={searchTerm} activeTab={activeTab} setSearchTerm={setSearchTerm} setGraphData={setGraphData} />
            {searchActive &&
                <SearchOptionsPanel searchTerm={searchTerm} activeTab={activeTab} setActiveTab={setActiveTab} setSearchTerm={setSearchTerm} />
            }
        </div>

    )
}

export default Search