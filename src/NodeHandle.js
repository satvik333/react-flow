import React, { memo, useEffect } from "react"
import { Handle, useUpdateNodeInternals } from "react-flow-renderer"
import { getPos } from "./functions.flowChart"

// Props are passed from WidgetWrapper
const NodeHandle = ({ transition, id }) => {
    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        updateNodeInternals(id)
    }, [id, transition, updateNodeInternals])

    return (transition ?? []).map((_trans, _transIndex) => {
        return <Handle key={_trans.id} id={_trans.id} type="source" style={{ left: `${getPos(_transIndex, parseInt(transition.length ?? 0, 10))}%` }} position="bottom" />
    })
}

export default memo(NodeHandle)
