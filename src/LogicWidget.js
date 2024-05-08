import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const LogicWidgetContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const LogicWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.LOGIC_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <LogicWidgetContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(LogicWidget)
