import React from 'react'
import NodeBadge from './NodeBadge'
import LinkBadges from './LinkBadges'


const SidePanel = ({ setData }) => {
    return (
        <div>
            <NodeBadge setData={setData} />
            <LinkBadges setData={setData} />
        </div>
    )
}

export default SidePanel