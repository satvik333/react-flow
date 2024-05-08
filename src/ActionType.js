import AutoComplete from "./AutoComplete"
// import useClientBasedConfig from "./useClientBasedConfig"
// import { TicketConfigList } from "./store/constants"
import React, { useCallback, useMemo } from "react"

const ActionTypes = [
    {
        label: "Notification",
        value: "notification",
    },
]

function ActionType({ handleChange, widgetData }) {
    // const chatFlowActionTypes = useClientBasedConfig(TicketConfigList.chatFlowActionTypes)
    const chatFlowActionTypes = ["FLIPKART_REOPEN"]

    const actionTypeList = useMemo(() => {
        let clientWiseActionTypes = []
        if (chatFlowActionTypes) {
            clientWiseActionTypes = chatFlowActionTypes.map(type => ({ label: type, value: type }))
        }

        return [...ActionTypes, ...clientWiseActionTypes]
    }, [chatFlowActionTypes])

    const handleActionTypeChange = useCallback(
        option => {
            handleChange("action_type", option?.value ?? option)
        },
        [handleChange]
    )

    return <AutoComplete className="mt-5" label="Action Type" freeSolo options={actionTypeList} value={widgetData?.data?.action_type} onChange={handleActionTypeChange} />
}

export default ActionType
