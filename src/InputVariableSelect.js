import React, { useContext, useEffect, useMemo, useState } from "react"
import ExpressionInputSelect from "./ExpressionInputSelect"
import FlowAppContext from "./FlowAppContext"
import { findVariables } from "./functions.flowChart"

function InputVariableSelect(props) {
    const { flowChartData } = useContext(FlowAppContext)
    const [variables, setVariables] = useState([])

    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === flowChartData.currentWidgetId), [flowChartData.currentWidgetId, flowChartData.flow])
    const parentId = widgetData?.data?.parentId ?? ""

    useEffect(() => {
        if (parentId) {
            const parentWidgetData = flowChartData.flow.find(_widget => _widget.id === parentId)
            setVariables(findVariables(parentWidgetData, [], flowChartData.flow) ?? [])
        }
    }, [flowChartData.flow, parentId])

    return <ExpressionInputSelect options={variables} {...props} />
}

export default InputVariableSelect
