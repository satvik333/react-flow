import React, { memo } from "react"
import { Handle } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import WidgetWrapper from "./WidgetWrapper"

import MessageBodyWidget from "./MessageBodyWidget"
import NodeHandle from "./NodeHandle"

// Props are passed from WidgetWrapper
const NLPEngineContents = ({ widgetData, id }) => {
    return (
        <>
            <Handle type="target" position="top" />
            <MessageBodyWidget body={widgetData?.data?.client_id} />
            <NodeHandle id={id} transition={widgetData?.data?.transition} />
        </>
    )
}

const NLPEngineWidget = props => {
    return (
        <WidgetWrapper classes="flowapp-widget-wrapper flex flex-col " widgetConfig={ChatFlowWidgetTypes.NLP_ENGINE_WIDGET} {...props}>
            {/* Props are passed from WidgetWrapper */}
            <NLPEngineContents id={props.id} />
        </WidgetWrapper>
    )
}

export default memo(NLPEngineWidget)
