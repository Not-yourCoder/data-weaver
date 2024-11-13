import NodeBadge from './NodeBadge'
import LinkBadges from './LinkBadges'
import React from 'react'


const SidePanel = ({ setData, setGraphLoading }) => {
    return (
        <div>
            <NodeBadge setData={setData} setGraphLoading={setGraphLoading} />
            <LinkBadges setData={setData} setGraphLoading={setGraphLoading} />
        </div>
    )
}

export default React.memo(SidePanel)