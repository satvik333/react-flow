import React, { memo } from "react"
import TextField from "@material-ui/core/TextField"

import InputVariableSelect from "../InputVariableSelect"
import ActionType from "../ActionType"

function EndOfFlowWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }

    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
            <InputVariableSelect label="Body" inputProps={{ multiline: true, rows: 3, rowsMax: 7 }} value={widgetData?.data?.body} onChange={handleFieldChange("body")} />
            <ActionType widgetData={widgetData} handleChange={handleChange} />
        </>
    )
}

export default memo(EndOfFlowWidgetSidebar)
