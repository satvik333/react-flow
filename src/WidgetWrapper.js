import { Card, CardContent, Icon, IconButton, Tooltip } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

import clsx from "clsx"
import React, { memo, useCallback, useContext, useMemo } from "react"
// import { ErrorBoundary } from "app/main/utilities"
import FlowAppContext from "./FlowAppContext"
import { setEditWidget, updateFlowChartData } from "./actions"
import ActionName from "./ActionName"
import { removeFlowChartElements } from "./functions.flowChart"
import { ChatFlowWidgetTypes } from "./constants"
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles({
    widgetContent: {
        paddingBottom: "0.5rem",
    },
})

const WidgetWrapper = ({ children, type, id, widgetConfig }) => {
    const { flowChartData, dispatch } = useContext(FlowAppContext)
    const classes = useStyles()
    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === id) ?? {}, [id, flowChartData])

    function handleWidgetSelect(evt) {
        dispatch(setEditWidget(null, type))
        setTimeout(() => dispatch(setEditWidget(id, type)))
    }

    const handleRemoveWidget = useCallback(
        e => {
            e.stopPropagation()
            removeFlowChartElements([widgetData], dispatch, flowChartData.flow)
        },
        [dispatch, flowChartData, widgetData]
    )

    const handleTextChange = fieldType => evt => {
        dispatch(updateFlowChartData(id, fieldType, evt.target.value))
    }

    // Update children with props
    const updatedChildren = React.Children.map(children, child => {
        return React.cloneElement(child, {
            handleTextChange,
            widgetData,
        })
    })

    return (
        <div>
            <Card
                className={clsx("flowapp-widget-wrapper flex flex-col shadow min-w-160 max-w-360", classes, flowChartData.currentWidgetId === id ? "focused" : "")}
                tabIndex={-1}
                onClick={handleWidgetSelect}
            >
                <div className={clsx("flex items-center p-3 border-b-1", widgetConfig.color)}>
                    <Tooltip title={widgetConfig.name}>{widgetConfig.icon}</Tooltip>
                    <ActionName name={widgetData?.data?.action_name} />
                    {widgetConfig.type !== ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type && (
                        <Tooltip title="Remove this step">
                            <CloseIcon className="text-red-400" style={{marginLeft: "10%"}} onClick={handleRemoveWidget}></CloseIcon>
                        </Tooltip>
                    )}
                </div>
                <CardContent className={clsx(classes.widgetContent, "p-4")}>{updatedChildren}</CardContent>
            </Card>
        </div>
    )
}

export default memo(WidgetWrapper)
