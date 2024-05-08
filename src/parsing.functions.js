import React from "react"
import LinkTag from "./LinkTag"

export function transform(node) {
    if (node.type === "tag" && node.name === "a") {
        return <LinkTag url={node?.attribs?.href ?? ""} />
    }

    // if (window.has(node?.attribs, "ref")) {
    //     node.attribs.ref = undefined
    // }

    return node?.data
}

export function dummy() {
    console.log("console.log")
}
