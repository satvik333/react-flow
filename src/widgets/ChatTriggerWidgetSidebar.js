import React, { memo } from "react"
import { TextField } from "@material-ui/core"

function ChatTriggerWidgetSidebar({ widgetData, handleEventChange }) {
    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
        </>
    )
}

export default memo(ChatTriggerWidgetSidebar)
