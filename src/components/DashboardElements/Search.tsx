import SearchBox from '@/modules/search/SearchBox'
import SearchOptionsPanel from '@/modules/search/SearchOptionsPanel'
import { setSearchActive } from '@/store/features/searchSlice'
import { RootState } from '@/store/store'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {
    className: string
    setGraphLoading: any
    setGraphData: React.Dispatch<React.SetStateAction<any>>
}
const Search = ({ className, setGraphData, setGraphLoading }: Props) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState({ id: 1, label: "Nodes" })
    const dispatch = useDispatch();

    const searchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                dispatch(setSearchActive(false));
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside); 
        };
    }, [dispatch]);
    const searchActive = useSelector((state: RootState) => state.search.searchActive);
    return (
        <div ref={searchRef} className='absolute left-[35%] z-50 w-[35rem] rounded flex flex-col gap-2'>
            <SearchBox className='w-full' searchTerm={searchTerm} activeTab={activeTab} setSearchTerm={setSearchTerm} setGraphData={setGraphData} setGraphLoading={setGraphLoading} />
            {searchActive &&
                <SearchOptionsPanel searchTerm={searchTerm} activeTab={activeTab} setActiveTab={setActiveTab} setSearchTerm={setSearchTerm} />
            }
        </div>

    )
}

export default Search