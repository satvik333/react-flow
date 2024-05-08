import React, { memo, useContext, useState } from "react"
import { FormControlLabel, Icon, IconButton, InputBase, Switch, TextField, Typography } from "@material-ui/core"
import RadioButton from "../RadioButton"
import { generateUid } from "../library.factory"
import InputVariableSelect from "../InputVariableSelect"
import { addFlowChartTransition } from "../actions"
import FlowAppContext from "../FlowAppContext"
import { createTransitionId } from "../functions.flowChart"
import ActionType from "../ActionType"

const typeOfs = [
    {
        label: "Menu",
        value: "menu",
    },
    {
        label: "Buttons",
        value: "buttons",
    },
]

const typeClass = {
    root: "mt-5",
}

const disableForAgentAssistant = true

function ListMsgWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const [newMsg, setNewMsg] = useState("")
    const { dispatch } = useContext(FlowAppContext)

    const handleListUpdate = id => evt => {
        const updateArr = widgetData?.data?.messageList.map(_msg => {
            if (_msg.id === id) {
                return {
                    ..._msg,
                    value: evt.target.value,
                }
            }
            return _msg
        })

        handleChange("messageList", updateArr)
    }

    const handleDelete = id => evt => {
        if (evt.keyCode === 8 && evt.target.calue === "") {
            handleChange(widgetData?.data?.messageList.filter(_msg => _msg.id !== id))
        }
    }

    function handleNextList(evt) {
        if (evt.keyCode === 13) {
            const transitionId = createTransitionId()
            dispatch(addFlowChartTransition(widgetData?.id, transitionId))
            handleChange("messageList", [...(widgetData?.data?.messageList ?? []), { value: evt.target.value, id: generateUid(), handleId: transitionId }])
            // fix:: for TextArea the value doesnt empty without timeout.
            setTimeout(() => setNewMsg(""))
        }
    }

    function handleTypeChange(value) {
        handleChange("message_type", value)
    }

    const handleRemoveListItem = msgId => () => {
        handleChange("messageList", [...(widgetData?.data?.messageList ?? []).filter(_msg => _msg.id !== msgId)])
    }

    function handleAllowReply(evt) {
        handleChange("allowReply", evt.target.checked)
    }

    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }

    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />

            <InputVariableSelect label="Message Body" inputProps={{ multiline: true, rows: 3 }} value={widgetData?.data?.body} onChange={handleFieldChange("body")} />
            {!disableForAgentAssistant && (
                <FormControlLabel
                    className="ml-0 mt-2"
                    control={<Switch className="ml-2" checked={widgetData?.data?.allowReply} onChange={handleAllowReply} size="small" />}
                    label="Allow Reply"
                    labelPlacement="start"
                />
            )}
            <RadioButton classes={typeClass} label="Type" options={typeOfs} value={widgetData?.data?.message_type} onChange={handleTypeChange} />

            <div className="flex flex-col mt-2">
                <Typography className="text-grey-600">Messages</Typography>
                {widgetData?.data?.messageList?.map((_msg, _msgIndex) => {
                    return (
                        <div className="flex items-start" key={_msg.id}>
                            <Typography className="text-16 font-600 mr-1">{`${_msgIndex + 1}.`}</Typography>
                            <InputBase multiline value={_msg.value} onKeyDown={handleDelete(_msg.id)} onChange={handleListUpdate(_msg.id)} />
                            <IconButton className="flex" size="small" onClick={handleRemoveListItem(_msg.id)}>
                                <Icon>close</Icon>
                            </IconButton>
                        </div>
                    )
                })}
                <InputBase multiline className="cursor-text" placeholder="Add a message" value={newMsg} onChange={evt => setNewMsg(evt.target.value)} onKeyDown={handleNextList} />
            </div>
            <ActionType widgetData={widgetData} handleChange={handleChange} />
        </>
    )
}

export default memo(ListMsgWidgetSidebar)
