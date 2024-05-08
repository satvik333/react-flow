import React, { memo } from "react"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import NodeHandle from "./NodeHandle"

const ChatTriggerContents = ({ widgetData, id }) => {
    return (
        <>
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const ChatTriggerWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-chatTrigger-widget flex flex-col border-t-8 border-red" widgetConfig={ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET} {...props}>
            <ChatTriggerContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(ChatTriggerWidget)
