import { Typography } from "@material-ui/core"
import React, { memo } from "react"

function ActionName({ name }) {
    if (name) {
        return <Typography className="p-2 font-600">{name}</Typography>
    }
    return null
}

export default memo(ActionName)
