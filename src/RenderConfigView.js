import { WidgetDataConfig, WidgetTriggerConfig } from "./WidgetProperties";
import WidgetVariables from "./WidgetVariables";
import { ChatFlowWidgetTypes, WidgetConfigTabKey } from "./constants"

 export default function RenderConfigView({ currentTab }) {
    switch (currentTab) {
        case WidgetConfigTabKey.data:
            return <WidgetDataConfig />
        case WidgetConfigTabKey.trigger:
            return <WidgetTriggerConfig />
        case WidgetConfigTabKey.vars:
            return <WidgetVariables />
        default:
            return null
    }
}