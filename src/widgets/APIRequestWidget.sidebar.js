import React, { memo } from "react"
import { TextField } from "@material-ui/core"
import InputVariableSelect from "../InputVariableSelect"

function APIRequestWidgetSideBar({ widgetData, handleEventChange, handleChange }) {
    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }

    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
            <InputVariableSelect label="URL" inputProps={{ multiline: true, rows: 3 }} value={widgetData?.data?.url} onChange={handleFieldChange("url")} />
        </>
    )
}

export default memo(APIRequestWidgetSideBar)
