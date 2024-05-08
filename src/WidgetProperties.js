import React, { useCallback, useContext, useMemo } from "react"
import { removeElements } from "react-flow-renderer"
import FlowAppContext from "./FlowAppContext"
import { removeFlowChartTransition, setFlowChartData, updateFlowChartData, updateFlowChartEdge } from "./actions"
import { ChatFlowWidgetTypes } from "./constants"
import SendMessageWidgetSidebar from "./SendMessageWidget.sidebar"
import Send_Wait_ReplyWidgetSidebar from "./widgets/Send_Wait_ReplyWidget.sidebar"
import ListMessageWidgetSidebar from "./widgets/ListMessageWidget.sidebar"
import APIRequestWidgetSidebar from "./widgets/APIRequestWidget.sidebar"
import CustomActionWidgetSidebar from "./widgets/CustomActionWidget.sidebar"
import ChatTriggerWidgetSidebar from "./widgets/ChatTriggerWidgetSidebar"
// import Transition from "./Transition"
import NLPEngineWidgetSidebar from "./widgets/NLPEngineWidget.sidebar"
import LogicWidgetSidebar from "./widgets/LogicWidget.sidebar"
// import ConditionExpression from "./ConditionExpression"
import EndOfFlowWidgetSidebar from "./widgets/EndOfFlowWidget.sidebar"

const WidgetSideBarList = {
    [ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type]: ChatTriggerWidgetSidebar,
    [ChatFlowWidgetTypes.SEND_MESSAGE_WIDGET.type]: SendMessageWidgetSidebar,
    [ChatFlowWidgetTypes.SEND_WAIT_REPLY_MESSAGE_WIDGET.type]: Send_Wait_ReplyWidgetSidebar,
    [ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type]: ListMessageWidgetSidebar,
    [ChatFlowWidgetTypes.API_REQUEST_WIDGET.type]: APIRequestWidgetSidebar,
    [ChatFlowWidgetTypes.CUSTOM_ACTION_WIDGET.type]: CustomActionWidgetSidebar,
    [ChatFlowWidgetTypes.NLP_ENGINE_WIDGET.type]: NLPEngineWidgetSidebar,
    [ChatFlowWidgetTypes.LOGIC_WIDGET.type]: LogicWidgetSidebar,
    [ChatFlowWidgetTypes.END_OF_FLOW_WIDGET.type]: EndOfFlowWidgetSidebar,
}

function WidgetDataConfig() {
    const { flowChartData, dispatch } = useContext(FlowAppContext)

    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === flowChartData.currentWidgetId), [flowChartData.currentWidgetId, flowChartData.flow])
    const { currentWidgetId } = flowChartData

    const handleEventChange = fieldType => evt => {
        dispatch(updateFlowChartData(flowChartData.currentWidgetId, fieldType, evt.target.value))
    }

    const handleChange = useCallback(
        (fieldType, value) => {
            dispatch(updateFlowChartData(currentWidgetId, fieldType, value))
        },
        [dispatch, currentWidgetId]
    )

    const WidgetSideBarView = WidgetSideBarList[widgetData.type]

    return (
        <div>
            <WidgetSideBarView widgetData={widgetData} handleChange={handleChange} handleEventChange={handleEventChange} />
        </div>
    )
}

function WidgetTriggerConfig() {
    const { flowChartData, dispatch } = useContext(FlowAppContext)

    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === flowChartData.currentWidgetId), [flowChartData.currentWidgetId, flowChartData.flow])

    const updateTransition = (transitionId, dataKey) => transValue => {
        const updatedTransition = [
            ...(widgetData?.data?.transition ?? []).map(_trans => {
                if (_trans.id === transitionId) {
                    return {
                        ..._trans,
                        [dataKey]: transValue,
                    }
                }
                return _trans
            }),
        ]

        const oldEdge = flowChartData.flow.find(_flowItem => _flowItem.sourceHandle === transitionId)
        if (oldEdge) {
            dispatch(updateFlowChartEdge(oldEdge.id, "label", transValue))
        }
        dispatch(updateFlowChartData(transitionId, "transition", updatedTransition))
        dispatch(updateFlowChartData(flowChartData.currentWidgetId, "transition", updatedTransition))
    }

    function removeTransition(evt) {
        const transitionId = evt.currentTarget.getAttribute("data-transitionid")
        const removingEdge = flowChartData.flow.find(_flowItem => _flowItem.sourceHandle === transitionId)
        if (removingEdge) {
            // dispatch(setFlowChartData(removeElements([removingEdge], flowChartData.flow)))
            dispatch(updateFlowChartData(removingEdge.target, "parentId", null))
        }
        dispatch(removeFlowChartTransition(transitionId, widgetData.id))
    }

    // if (widgetData.type === ChatFlowWidgetTypes.LOGIC_WIDGET.type) {
    //     return <ConditionExpression updateTransition={updateTransition} removeTransition={removeTransition} />
    // }

    // return <Transition updateTransition={updateTransition} removeTransition={removeTransition} />
}


export { WidgetDataConfig, WidgetTriggerConfig };