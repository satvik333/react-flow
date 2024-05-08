import React, { memo } from "react"
import { TextField } from "@material-ui/core"
import InputVariableSelect from "../InputVariableSelect"

function SendWaitReplyWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }
    return (
        <>
            <TextField className="w-full mt-5" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
            <InputVariableSelect label="Message Body" inputProps={{ multiline: true, rows: 3, rowsMax: 7 }} value={widgetData?.data?.body} onChange={handleFieldChange("body")} />
            <TextField
                className="w-full mt-5"
                label="Wait Duration"
                type="number"
                helperText="In seconds"
                value={widgetData?.data?.waitDuration}
                onChange={handleEventChange("waitDuration")}
            />
        </>
    )
}

export default memo(SendWaitReplyWidgetSidebar)
