import React from "react"
import { openLinkInNewTab } from "./library.factory"

const LinkTag = props => {
    const openLink = evt => {
        if (evt) {
            evt.preventDefault()
        }
        openLinkInNewTab(props?.url)
    }
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a href={props?.url ?? ""} target="_blank" rel="noopener noreferrer" onClick={openLink}>
            {props?.url ?? ""}
        </a>
    )
}

export default LinkTag
