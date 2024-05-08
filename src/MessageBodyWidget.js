import React, { memo } from "react"
import ReactHtmlParser from "react-html-parser"
import { Typography } from "@material-ui/core"
import { transform } from "./parsing.functions"

const options = {
    transform,
}

function MessageBodyWidget({ body }) {
    if (body) {
        return (
            <Typography className="p-2 bg-grey-100 italic" variant="body2" component="pre">
                {ReactHtmlParser(body, options)}
            </Typography>
        )
    }
    return null
}

export default memo(MessageBodyWidget)
