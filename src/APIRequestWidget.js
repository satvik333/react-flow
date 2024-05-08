import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const APIRequestContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.url} />
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const APIRequestWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.API_REQUEST_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <APIRequestContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(APIRequestWidget)
