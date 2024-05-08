import React,  { useContext, useMemo, useState } from "react"
import { Icon, IconButton, Typography } from "@material-ui/core"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { FuseScrollbars } from "@fuse"
import AntTabs from "./AntTabs"
import AntTab from "./AntTab"
import { setEditWidget } from "./actions"
import { ChatFlowWidgetTypes, WidgetConfigTabKey } from "./constants"
import FlowAppContext from "./FlowAppContext"
import RenderConfigView from "./RenderConfigView"

const WidgetConfigView = ({ flowPropsData }) => {
    const [currentTab, setCurrentTab] = useState(WidgetConfigTabKey.data)
    const { flowChartData } = useContext(FlowAppContext)

    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === flowChartData.currentWidgetId), [flowChartData.currentWidgetId, flowChartData.flow])

    function closeView() {
        flowPropsData.dispatch(setEditWidget(0, null))
    }

    function handleTabChange(evt, tabValue) {
        setCurrentTab(tabValue)
    }

    return (
        <>
            <div className="flex shadow mb-1 py-3">
                <IconButton className="mr-2" size="small" onClick={closeView}>
                    <ArrowBackIcon>arrow_back</ArrowBackIcon>
                </IconButton>
                <Typography className="description " variant="h6">
                    Properties
                </Typography>
            </div>
            <AntTabs className="shadow" variant="fullWidth" value={currentTab} onChange={handleTabChange}>
                {!ChatFlowWidgetTypes[widgetData.type].disabledConfigs?.includes(WidgetConfigTabKey.data) && <AntTab label="Data" value={WidgetConfigTabKey.data} />}
                {/* {!ChatFlowWidgetTypes[widgetData.type].disabledConfigs?.includes(WidgetConfigTabKey.trigger) && <AntTab label="Triggers" value={WidgetConfigTabKey.trigger} />} */}
                {!ChatFlowWidgetTypes[widgetData.type].disabledConfigs?.includes(WidgetConfigTabKey.vars) && <AntTab label="Variables" value={WidgetConfigTabKey.vars} />}
            </AntTabs>
            {/* <FuseScrollbars className="flowapp-widget-config px-2"> */}
                <RenderConfigView currentTab={currentTab} />
            {/* </FuseScrollbars> */}
        </>
    )
}

export default WidgetConfigView
