import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { Typography } from "@material-ui/core"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const CustomActionContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.body} />
            {widgetData?.data?.javaMethod && widgetData?.data?.javaClass && (
                <div>
                    <Typography component="span">Call method&nbsp;</Typography>
                    <Typography component="span" className="bg-red-100 px-2 rounded-6 font-700">
                        {widgetData?.data?.javaMethod}
                    </Typography>
                    <Typography component="span">&nbsp;from class&nbsp;</Typography>
                    <Typography component="span" className="bg-red-100 px-2 rounded-6 font-700">
                        {widgetData?.data?.javaClass}
                    </Typography>
                </div>
            )}
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const CustomActionWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.CUSTOM_ACTION_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <CustomActionContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(CustomActionWidget)
