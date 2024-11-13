import { SearchOptionsPanelTabs } from "@/constants/data"
import { Link, Workflow } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {  useSelector } from "react-redux";

type Props = {
    className?: string
    activeTab: { id: number, label: string}
    setActiveTab: Dispatch<SetStateAction<any>>
    searchTerm: string
    setSearchTerm: Dispatch<SetStateAction<string>>
}

const SearchOptionsPanel = ({ className, activeTab, setActiveTab, searchTerm, setSearchTerm }: Props) => {

    const [filteredNodes, setFilteredNodes] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);

    const { nodesList, loading: nodesLoading, error: nodesError } = useSelector((state: any) => state.nodes);
    const { linksList, loading: linksLoading, error: linksError } = useSelector((state: any) => state.links);


    // Filter data whenever searchTerm changes
    useEffect(() => {
        if (nodesList && linksList) {
            // Filter nodes
            const nodesFiltered = searchTerm
                ? nodesList.filter(node =>
                    node._fields[0][0].toLowerCase().includes(searchTerm.toLowerCase()))
                : nodesList;
            setFilteredNodes(nodesFiltered);

            // Filter links
            const linksFiltered = searchTerm
                ? linksList.filter(link =>
                    link.toLowerCase().includes(searchTerm.toLowerCase()))
                : linksList;
            setFilteredLinks(linksFiltered);
        }
    }, [searchTerm, nodesList, linksList]);

    const handleActiveTab = (tabs: { id: number; label?: string; }) => {
        setActiveTab(tabs)
    }

    // const handleLinks = async (link) => {
    //     const relationshipType = link._fields[0][0];
    //     const result = await dispatch(fetchNodesbyLinks(relationshipType));
    //     console.log(result)
    // };

    if (nodesLoading || linksLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-slate-500">Loading...</div>
            </div>
        );
    }

    if (nodesError || linksError) {
        return (
            <div className="flex items-center justify-center p-4 text-red-500">
                {nodesError || linksError}
            </div>
        );
    }

    return (
        <div className={`${className} bg-white h-fit max-h-72 scrollbar overflow-y-auto rounded-md`}>
            <div className="flex absolute rounded-md bg-white items-center gap-2 w-full pt-4 px-2 h-12 ">
                {SearchOptionsPanelTabs.map((tabs) => (
                    <div
                        key={tabs.id}
                        onClick={() => handleActiveTab(tabs)}
                        className={`flex items-center gap-1 border-2 border-slate-300 rounded-md px-2 py-1 duration-200 cursor-pointer ${activeTab.id === tabs.id ? 'bg-red-500 text-white' : 'bg-white'
                            }`}
                    >
                        {tabs.id === 1 ? <Workflow className="w-4" /> : <Link className="w-4" />}
                        <p>{tabs.label}</p>
                    </div>
                ))}
            </div>

            {(activeTab.id === 1 && filteredNodes.length === 0) ||
                (activeTab.id === 2 && filteredLinks.length === 0) ? (
                <div className="p-4 text-center text-slate-500">
                    No results found
                </div>
            ) : (
                <ul className="flex flex-col gap-2 mt-14 p-2">
                    {activeTab.id === 1
                        ? filteredNodes.map((node, index) => (
                            <li
                                key={index}
                                className="p-1.5 hover:bg-slate-100 cursor-pointer rounded"
                                onClick={() => setSearchTerm(node._fields[0][0])}
                            >
                                {node._fields[0][0]}
                            </li>
                        ))
                        : filteredLinks.map((link, index) => (
                            <li
                                key={index}
                                className="p-1.5 hover:bg-slate-100 cursor-pointer rounded"
                                onClick={() => setSearchTerm(link)}
                            >
                                {link}
                            </li>
                        ))
                    }
                </ul>
            )}
        </div>
    )
}

export default SearchOptionsPanel