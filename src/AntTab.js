/*
 * Component to show if no data is available
 */

import React from "react"
import { withStyles, Tab, Tooltip } from "@material-ui/core"

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    tabsIndicator: {
        backgroundColor: "#1890ff",
    },
    tabRoot: {
        textTransform: "initial",
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        // marginRight: theme.spacing(4), commented this. DONOT change
        fontFamily: "Open Sans, sans-serif",
        "&:hover": {
            // color: "#40a9ff",
            opacity: 1,
        },
        "&$tabSelected": {
            fontWeight: theme.typography.fontWeightMedium,
        },
        "&:focus": {
            // color: "#40a9ff",
        },
    },
    // textColorInherit: {
    //     opacity: 0.5,
    // },
    tabSelected: {},
    typography: {
        padding: theme.spacing(3),
    },
})

function AntTab(props) {
    const { classes } = props

    //  Do not pass classes props.
    const currProps = { ...props }
    const { tabTitle } = currProps

    delete currProps.classes
    delete currProps.tabTitle

    if (props.disableTooltip || !tabTitle) {
        return (
            <Tab
                {...currProps}
                disableRipple
                classes={{
                    root: classes.tabRoot,
                    selected: classes.tabSelected,
                    textColorInherit: classes.textColorInherit,
                }}
            />
        )
    }
    return (
        <Tooltip title={tabTitle} placement="left">
            <Tab
                {...currProps}
                disableRipple
                classes={{
                    root: classes.tabRoot,
                    selected: classes.tabSelected,
                    textColorInherit: classes.textColorInherit,
                }}
            />
        </Tooltip>
    )
}

export default React.memo(withStyles(styles)(AntTab))
