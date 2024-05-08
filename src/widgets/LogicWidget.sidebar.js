import React from "react"
import { TextField } from "@material-ui/core"

function LogicWidgetSidebar({ widgetData, handleEventChange }) {
    return (
        <>
            <TextField className="w-full mt-5" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
        </>
    )
}

export default LogicWidgetSidebar
