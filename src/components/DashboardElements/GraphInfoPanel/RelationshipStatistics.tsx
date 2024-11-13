const RelationshipStatistics = ({ links }) => {
    return (
        <div>
            <h1 className='text-xl mb-2'>Relationships <span>({links.length})</span></h1>
            <div className='flex flex-wrap gap-2'>
                {[...new Set(links.map(link => link.type))].map((type, index) => (
                    <span
                        key={index}
                        className="bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium w-fit px-2.5 py-1 transition-all duration-300 hover:shadow-sm rounded-full hover:cursor-pointer hover:text-slate-900"
                    >
                        {type}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default RelationshipStatistics