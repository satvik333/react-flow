import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"
import MessageBodyWidget from "./MessageBodyWidget"

// Props are passed from WidgetWrapper
const EndOfFlowContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.body} />
        </>
    )
}

const EndOfFlowWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col border-t-8 border-red" widgetConfig={ChatFlowWidgetTypes.END_OF_FLOW_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <EndOfFlowContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(EndOfFlowWidget)
