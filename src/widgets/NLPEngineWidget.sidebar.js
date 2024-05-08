import React, { memo } from "react"
import { TextField } from "@material-ui/core"
import InputVariableSelect from "../InputVariableSelect"

function NLPEngineWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }
    return (
        <>
            <TextField className="w-full mt-5" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
            <InputVariableSelect label="Client ID" value={widgetData?.data?.client_id} onChange={handleFieldChange("client_id")} />
        </>
    )
}

export default memo(NLPEngineWidgetSidebar)
