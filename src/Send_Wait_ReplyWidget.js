import { Icon, Typography } from "@material-ui/core"
import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const SendMessageReplyContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.body} />
            {widgetData?.data?.waitDuration && (
                <div className="flex mt-2 text-blue-600">
                    <Icon className="mr-1">timelapse</Icon>
                    <Typography className="font-600 text-16">{widgetData?.data?.waitDuration}</Typography>
                </div>
            )}
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const SendMessageWaitReply = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.SEND_WAIT_REPLY_MESSAGE_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <SendMessageReplyContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(SendMessageWaitReply)
