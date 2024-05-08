import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { Icon, Typography } from "@material-ui/core"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"
import ListMessageBodyWidget from "./ListMessageBodyWidget"

// Props are passed from WidgetWrapper
const ListMessageContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.body} />
            {widgetData?.data?.allowReply && (
                <div className="flex py-3 text-blue-700">
                    <Icon fontSize="small">reply</Icon>
                    <Typography className="ml-3 text-13">Reply Allowed</Typography>
                </div>
            )}
            <ListMessageBodyWidget messages={widgetData?.data?.messageList} />
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const ListMessageWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <ListMessageContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(ListMessageWidget)
