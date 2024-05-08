import { Typography } from "@material-ui/core"
import { isEmptyOrUndefine } from "./library.factory"
import React, { memo } from "react"

const ListMessageBodyWidget = ({ messages }) => {
    if (isEmptyOrUndefine(messages)) {
        return null
    }
    return (
        <div className="mt-2 p-2 bg-grey-100 italic">
            {messages.slice(0, 5).map((_msg, _msgIndex) => (
                <Typography key={_msg.id} className="font-600 mr-1 text-wrap-breakword">{`${_msgIndex + 1}. ${_msg.value}`}</Typography>
            ))}
            {messages.length > 5 ? <div>...</div> : ""}
        </div>
    )
}

export default memo(ListMessageBodyWidget)
