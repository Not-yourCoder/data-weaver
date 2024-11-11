import React from 'react'
import NodeBadge from './SidePanel/NodeBadge'
import LinkBadges from './SidePanel/LinkBadges'


const SidePanel = ({ setData }) => {
    return (
        <div>
            <NodeBadge setData={setData} />
            <LinkBadges setData={setData} />
        </div>
    )
}

export default SidePanel