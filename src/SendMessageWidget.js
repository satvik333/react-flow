import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"
import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const SendMessageContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.body} />
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const SendMessageWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.SEND_MESSAGE_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <SendMessageContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(SendMessageWidget)
