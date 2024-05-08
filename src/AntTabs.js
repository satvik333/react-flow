/*
 * Component to show if no data is available
 */

import React from "react"
import { Tabs, withStyles } from "@material-ui/core"

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsIndicator: {
        backgroundColor: "#0D47A1",
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing(3),
    },
})

function AntTabs(props) {
    const { classes } = props

    //  Do not pass classes props.
    const currProps = { ...props }
    delete currProps.classes

    return (
        <Tabs
            {...currProps}
            classes={{
                root: classes.tabsRoot,
                indicator: classes.tabsIndicator,
            }}
        >
            {props.children}
        </Tabs>
    )
}

export default withStyles(styles)(AntTabs)
