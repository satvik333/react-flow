import React, { useState, useRef, useEffect, useReducer, useMemo, memo } from "react"
import ReactFlow, { addEdge, Controls, Background, updateEdge } from "react-flow-renderer"
import { Button, Icon, IconButton, InputBase, Tooltip, Typography } from "@material-ui/core"
import StorageHandler from "./storage.handler"
import { generateUid } from "./library.factory"
// import { useDispatch, useSelector } from "react-redux"
import { useHistory, useRouteMatch } from "react-router-dom"
import clsx from "clsx"
// import { BASE_URL, GLOBAL_NOTI_TYPES } from "./store/constants"
// import { sendNotification } from "app/store/actions/notifications"
import URLReaderService, { UtilityParams } from "./urlreader.service"
import WidgetSideBar from "./WidgetSideBar"
import FlowAppContext from "./FlowAppContext"
import "./dnd.css"
import SendMessageWidget from "./SendMessageWidget"
import { ChatFlowWidgetTypes } from "./constants"
import APIRequestWidget from "./APIRequestWidget"
import SendMessageWaitReplyWidget from "./Send_Wait_ReplyWidget"
import flowChartReducer, { initialState } from "./flowChart.reducer"
import { resetFlowChartData, setEditWidget, setFlowChartData, updateFlowChartData } from "./actions"
import CustomActionWidget from "./CustomActionWidget"
import WidgetConfigView from "./WidgetConfigView"
import ListMessageWidget from "./ListMessageWidget"
import NLPEngineWidget from "./NLPEngineWidget"
import {
    convertDecisionTreeToFlowChart,
    convertFlowToDecisionTreeFlow,
    createEdge,
    createNode,
    goToFlowDetails,
    isConnectionCycle,
    removeFlowChartElements,
} from "./functions.flowChart"
import LogicWidget from "./LogicWidget"
import EndOfFlowWidget from "./EndOfFlowWidget"
// import { getAssistantConfigByCMID, getChatBotFlowData, saveChatBotFlowData } from "./fetcher"
import ChatTriggerWidget from "./ChatTriggerWidget"
// import { DummyDecisionTree } from "../../../test_module/TestModule"

const nodeTypes = {
    [ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type]: ChatTriggerWidget,
    [ChatFlowWidgetTypes.API_REQUEST_WIDGET.type]: APIRequestWidget,
    [ChatFlowWidgetTypes.CUSTOM_ACTION_WIDGET.type]: CustomActionWidget,
    [ChatFlowWidgetTypes.SEND_MESSAGE_WIDGET.type]: SendMessageWidget,
    [ChatFlowWidgetTypes.SEND_WAIT_REPLY_MESSAGE_WIDGET.type]: SendMessageWaitReplyWidget,
    [ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type]: ListMessageWidget,
    [ChatFlowWidgetTypes.NLP_ENGINE_WIDGET.type]: NLPEngineWidget,
    [ChatFlowWidgetTypes.LOGIC_WIDGET.type]: LogicWidget,
    [ChatFlowWidgetTypes.END_OF_FLOW_WIDGET.type]: EndOfFlowWidget,
}

// current dragging connectionLine
let connectingLine = null

// if new, then generate flowID while adding,
// if edit, then fetch DT json, convert and save like new.
// if existing update data according to the flowID and clientKey.

const FlowPlayground = () => {
    const reactFlowWrapper = useRef(null)
    const [reactFlowInstance, setReactFlowInstance] = useState(null)
    const [flowTitle, setFlowTitle] = useState("")
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // const dispatch = useDispatch()
    // const [connectingLine, setConnectingLine] = useState(null)
    const [flowChartData, localDispatch] = useReducer(flowChartReducer, initialState)
    const user = "userData"
    // const { transform } = useZoomPanHelper()
    // const match = useRouteMatch()

    // const history = useHistory()
    // const {
    //     params: { flowId },
    // } = match

    // const isIframe = URLReaderService.getUtilityParamValue(UtilityParams.is_iframe_content)
    const empId = user?.empId

    // Load cached data.
    // useEffect(() => {
    //     let agentId = empId
    //     if (!agentId) {
    //         agentId = StorageHandler.getStorageData("localStorage", "flowChartUID")
    //     }

    //     const decisionTreeId = URLReaderService.cleanUrlSearchParamsObj().get("decisionTreeId")
        // if (flowId === "new" && decisionTreeId) {
            // getAssistantConfigByCMID(decisionTreeId).then(decisionTreeData => {
            //     // const cachedFlowInstance = convertDecisionTreeToFlowChart(DummyDecisionTree)
            //     if (decisionTreeData) {
            //         const cachedFlowInstance = convertDecisionTreeToFlowChart(decisionTreeData)
            //         const [x = 0, y = 0] = cachedFlowInstance.position
            //         localDispatch(setFlowChartData(cachedFlowInstance.elements || []))
            //         transform({ x, y, zoom: cachedFlowInstance.zoom || 0 })
            //         setFlowTitle("")
            //     }
            // })
        // } else if (empId && flowId && flowId !== "new") {
            // getChatBotFlowData({ agentId, flowId })
            //     .then(res => {
            //         const cachedFlowInstance = res.flowData
            //         if (cachedFlowInstance && res.title) {
            //             const [x = 0, y = 0] = cachedFlowInstance.position
            //             localDispatch(setFlowChartData(cachedFlowInstance.elements || []))
            //             transform({ x, y, zoom: cachedFlowInstance.zoom || 0 })
            //             setFlowTitle(res.title)
            //         }
            //     })
            //     .catch(er => {
            //         if (er.status === "error" && er.err_code === "401") {
            //             // history.push(`${BASE_URL}/configurations/general/chat-flow-config`)
            //         }
            //     })
        // }
    // }, [flowId, history, empId])

    const saveFlow = () => {
        let agentId = user.id

        if (!agentId) {
            agentId = generateUid()
            StorageHandler.setStorageData("localStorage", "flowChartUID", agentId)
        }
        console.log(flowTitle,'iddddddddddddddddddddd')

        const containsTrigger = flowChartData.flow.find(_widgets => _widgets.type === ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type)
        if (!containsTrigger) {
            // dispatch(sendNotification("Chat Trigger is required.", GLOBAL_NOTI_TYPES.error))
            return false
        }

        const reqStruct = {
            flowData: reactFlowInstance.toObject(),
            agentId: user.empId,
            // flowId,
            flowTitle,
        }

        console.log(reqStruct,'resqqqqqqqqqqqqqqqqqq')

        // saveChatBotFlowData(reqStruct)
        //     .then(res => {
        //         // if new flow is saved, redirect to its flowId page.
        //         // dispatch(sendNotification("Chat Flow is saved.", GLOBAL_NOTI_TYPES.success))
        //         // send the decision tree data to, Decision Tree UI.
        //         const decisionTreeId = URLReaderService.cleanUrlSearchParamsObj().get("decisionTreeId")
        //         const enableForLocal = true
        //         if (enableForLocal || (URLReaderService.getUtilityParamValue(UtilityParams.is_iframe_content) && decisionTreeId !== null)) {
        //             const decisionTree = {
        //                 key: "SET_DECISION_TREE",
        //                 detail: {
        //                     flowId: res.flowId,
        //                     decisionTree: convertFlowToDecisionTreeFlow(reqStruct.flowData),
        //                 },
        //             }
        //             window.parent.postMessage({ decisionTree })
        //         }
        //         if (flowId === "new" && res.flowId) {
        //             goToFlowDetails(history, res.flowId)
        //         }
        //     })
        //     .catch(er => {
        //         // dispatch(sendNotification("Chat Flow failed to save.", GLOBAL_NOTI_TYPES.error))
        //     })

        // StorageHandler.setStorageData("localStorage", "flowData", reactFlowInstance.toObject())
    }

    const clearFlow = () => {
        StorageHandler.removeStorageData("localStorage", "flowData")
        localDispatch(resetFlowChartData())
    }

    const handleFlowTitleChange = evt => {
        setFlowTitle(evt.target.value)
    }

    function goToFlowList() {
        // const detailPageUrl = `${BASE_URL}/configurations/general/chat-flow-config`
        // history.push(detailPageUrl)
    }

    // gets called after end of edge gets dragged to another source or target
    const onEdgeUpdate = (oldEdge, newConnection) => {
        console.log("onEdgeUpdate", oldEdge, newConnection)
        localDispatch(setFlowChartData(updateEdge(oldEdge, newConnection, flowChartData.flow)))
    }

    // While connecting edge
    const onConnect = params => {
        let edgeLabel = ""

        if (params.source === params.target) {
            return false
        }

        const sourceWidget = flowChartData.flow.find(_widget => _widget.id === params.source)

        // TODO - validate if sourceHandle already has a transition.
        // const hasChild = getOutgoers(sourceWidget, flowChartData.flow)?.length > 0
        // if source edge already has a transition
        // if (hasChild) {
        // return
        // }

        const isLoopConnection = isConnectionCycle(sourceWidget, params.target, flowChartData.flow)

        if (isLoopConnection) {
            return false
        }

        flowChartData.flow.forEach(_el => {
            // Check if the target node is already having a parent
            if (_el.id === params.source) {
                const handleTrans = (_el?.data?.transition ?? []).find(_trans => _trans.id === params.sourceHandle)
                edgeLabel = handleTrans.label
            }
        })

        // default edge styles and param
        const edge = createEdge({ ...params, label: edgeLabel })

        localDispatch(setFlowChartData(addEdge(edge, flowChartData.flow)))
        localDispatch(updateFlowChartData(params.target, "parentId", params.source))
    }

    const onConnectEnd = evt => {
        console.log("onConnectEnd", evt)
        let targetNodeId = ""
        console.log("onConnectEndParams", connectingLine)
        if (evt.path && connectingLine) {
            // eslint-disable-next-line no-restricted-syntax
            for (const el of evt.path) {
                if (el.classList?.contains("react-flow__node")) {
                    targetNodeId = el.getAttribute("data-id")
                    break
                }
            }

            // const targetHandle = getIncomers(targetNodeId)
            onConnect({ source: connectingLine.nodeId, sourceHandle: connectingLine.handleId, target: targetNodeId, targetHandle: null })
            connectingLine = null
        }
    }

    const onConnectStart = (evt, connectParams) => {
        connectingLine = connectParams
    }

    const onElementsRemove = elementsToRemove => {
        removeFlowChartElements(elementsToRemove, localDispatch, flowChartData.flow)
    }
    const onLoad = _reactFlowInstance => {
        setReactFlowInstance(_reactFlowInstance)
    }

    const onDragOver = event => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "move"
    }
    const onDrop = event => {
        event.preventDefault()
        if (reactFlowWrapper.current != null) {
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const type = event.dataTransfer.getData("application/reactflow")
            const nodeData = event.dataTransfer.getData("nodeData") ?? ""
            let nodeDataJson = {}
            try {
                nodeDataJson = JSON.parse(nodeData)
            } catch (er) {
                console.error("Error in onDrop::FlowPlayground", er, nodeData)
                nodeDataJson = {}
            }
            if (reactFlowInstance) {
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                })

                const newNode = createNode(type, nodeDataJson, position)
                localDispatch(setFlowChartData(flowChartData.flow.concat(newNode)))
                localDispatch(setEditWidget(newNode.id, type))
            }
        }
    }

    const flowPropsData = useMemo(() => {
        return { flowChartData, dispatch: localDispatch, reactFlowInstance }
    }, [flowChartData, localDispatch, reactFlowInstance])

    // useEffect(() => {
    //     console.log("elements", flowChartData)
    // }, [flowChartData])

    return (
        <div className={`dndflow ${theme === "light" ? "light-mode" : "dark-mode"}`}>
            <FlowAppContext.Provider value={flowPropsData}>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        onLoad={onLoad}
                        onDrop={onDrop}
                        nodeTypes={nodeTypes}
                        onConnect={onConnect}
                        minZoom={0}
                        onDragOver={onDragOver}
                        onEdgeUpdate={onEdgeUpdate}
                        elements={flowChartData.flow}
                        onElementsRemove={onElementsRemove}
                        onConnectEnd={onConnectEnd}
                        onConnectStart={onConnectStart}
                        connectionMode="loose"
                        selectNodesOnDrag={false}
                        connectionLineType="straight"
                    >
                        <Controls />
                    </ReactFlow>
                </div>
                <aside className="shadow rounded-6 z-9999" style={theme === "light" ? {backgroundColor: "white"} : {backgroundColor: "black"}}>
                    {flowChartData?.currentWidgetId ? <WidgetConfigView flowPropsData={flowPropsData} /> : <WidgetSideBar flowPropsData={flowPropsData} />}
                    {!flowChartData?.currentWidgetId && (
                        <>
                            <InputBase
                                inputProps={{ className: "placeholder-red" }}
                                className={clsx("p-3 w-full text-15")}
                                placeholder="Flow Title"
                                value={flowTitle}
                                onChange={handleFlowTitleChange}
                            />
                            <div className="flex border-t-2">
                                <Button variant="text" className="flex flex-1" color='primary' onClick={clearFlow}>
                                    Clear
                                </Button>
                                <Button variant="text" color="primary" className="flex flex-1" onClick={saveFlow}>
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                    <Tooltip title="Toggle Theme">
                        <Button onClick={toggleTheme} style={theme === "light" ? {color: "black"} : {color: "white"}}>
                            {theme === "light" ? "Dark" : "Light"} Mode
                        </Button>
                    </Tooltip>
                </aside>
            </FlowAppContext.Provider>
        </div>
    )
}

export default memo(FlowPlayground)
