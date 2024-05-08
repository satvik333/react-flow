import React from "react"
import { Typography } from "@material-ui/core"
// import { takeScreenshot } from "app/main/utilities/library.factory"
// import { getClientBasedConfig, TicketConfigList } from "app/store/constants"
// import { useSelector } from "react-redux"
import WidgetSideBarItem from "./WidgetSideBarItem"
import { ChatFlowWidgetTypes } from "./constants"

const WidgetSideBar = () => {
    const clientKey = '1234'
    const disabledTypes = 'none'

    return (
        <>
            <Typography className="description shadow py-5 pl-5 mb-1" variant="h6">
                Widget Library
            </Typography>
            <div className="overflow-y-auto flex-1">
                {Object.keys(ChatFlowWidgetTypes)
                    .filter(type => !disabledTypes.includes(type))
                    .map(_widgetType => {
                        return (
                            <WidgetSideBarItem
                                key={_widgetType}
                                name={ChatFlowWidgetTypes[_widgetType].name}
                                icon={ChatFlowWidgetTypes[_widgetType].icon}
                                type={_widgetType}
                                desc={ChatFlowWidgetTypes[_widgetType].detail}
                            />
                        )
                    })}
            </div>
        </>
    )
}

export default WidgetSideBar
