import { generateUid } from "./library.factory"
import { addEdge, getIncomers, getOutgoers, removeElements } from "react-flow-renderer"
import { ChatFlowWidgetTypes } from "./constants"
import { setEditWidget, setFlowChartData, updateFlowChartData } from "./actions"

export const addWidgetToFlow = (nodeType, data) => evt => {
    let nodeData = ""
    try {
        nodeData = JSON.stringify(data)
    } catch (er) {
        console.error("addWidgetToFlow", er, data)
        nodeData = ""
    }

    evt.dataTransfer.setData("application/reactflow", nodeType)
    evt.dataTransfer.setData("nodeData", nodeData)
    evt.dataTransfer.effectAllowed = "move"
}

export const getPos = (_transIndex, transitionCount) => ((_transIndex + 1) / (transitionCount + 1)) * 100

export function createTransitionId() {
    return `handle_${generateUid()}`
}

export function findObjectByType(type, id, elements) {
    return elements.find(_flow => _flow[type] === id)
}

export function findVariables(thisWidget, variableList, flowData) {
    let _variableList = [...variableList]
    if (thisWidget?.data?.variables) {
        _variableList = [
            ..._variableList,
            ...Object.keys(thisWidget.data.variables).map(_varKey => {
                let varLabel = thisWidget.data.variables[_varKey]
                if (typeof thisWidget.data.variables[_varKey] === "object") {
                    varLabel = _varKey
                }
                return {
                    label: varLabel,
                    value: thisWidget.data.variables[_varKey], // if nested object set object as the value
                }
            }),
        ]
    }
    // if this wigdet has parent node then search through, else stop.
    if (thisWidget?.data?.parentId && thisWidget?.data?.parentId !== thisWidget?.id) {
        return findVariables(
            flowData.find(_widget => _widget.id === thisWidget?.data?.parentId),
            _variableList,
            flowData
        )
    }
    return _variableList
}

// check if target widget is a parent of sourceWidget.
export function isConnectionCycle(sourceWidget, targetWidgetId, flowData) {
    let isSourceParent = false
    const traverse = thisWidget => {
        const parents = getIncomers(thisWidget, flowData)

        if (thisWidget.id === targetWidgetId) {
            isSourceParent = true
        } else {
            parents.forEach(_parent => traverse(_parent))
        }
    }
    traverse(sourceWidget)
    return isSourceParent
}

export function createEdge(params) {
    const edgeParams = {
        label: "transition 1",
        ...params,
        animated: true,
        type: "step",
        labelStyle: { fontSize: "15", fill: "#ffffff" },
        labelBgStyle: { fill: "#1e8de6" },
        labelBgPadding: [3, 5],
        style: { strokeWidth: 4, cursor: "pointer" },
    }
    return edgeParams
}

export function createNode(type, data, position) {
    const getId = () => `dndnode_${generateUid()}`

    const defaultTransition = () => {
        if (type === ChatFlowWidgetTypes.LOGIC_WIDGET.type) {
            return [
                { id: createTransitionId(), label: "", expType: `IF Expression` },
                { id: createTransitionId(), label: ``, expType: "ELSE" },
            ]
        }
        if (type === ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type) {
            return []
        }
        return [{ id: createTransitionId(), label: `transition_1` }]
    }

    const newNode = {
        id: getId(),
        type,
        position,
        data: {
            label: `${type}`,
            transition: defaultTransition(),
            ...({ variables: ChatFlowWidgetTypes[type]?.variables } ?? {}),
            ...(ChatFlowWidgetTypes[type]?.defaultData ?? {}),
            ...data,
        },
    }

    return newNode
}

export function goToFlowDetails(history, flowId) {
    let newFlowUrl = history?.location?.pathname
    if (newFlowUrl.includes("new")) {
        newFlowUrl = newFlowUrl.replace("new", flowId)
    } else if (newFlowUrl.endsWith("/")) {
        newFlowUrl += flowId
    } else {
        newFlowUrl = `${newFlowUrl}/${flowId}`
    }
    newFlowUrl += history.location.search
    history.push(newFlowUrl)
}

// Convert Decision Tree to Flow Chart format.
export function convertDecisionTreeToFlowChart(json) {
    if (!json) {
        return
    }
    let reactFlowFormat = []

    // maintain a map of DecisionTree node Key and ChatFlow ID.
    // which will used for mapping parent->child.
    const nodeKeyIdMap = new Map()

    function addEdgeData(sourceKey, targetKey, transitionIndex) {
        const source = findObjectByType("id", nodeKeyIdMap.get(sourceKey), reactFlowFormat)
        const target = findObjectByType("id", nodeKeyIdMap.get(targetKey), reactFlowFormat)
        const handleId = source.data.transition?.[transitionIndex]?.id

        const handle = source?.data?.transition?.find(_handle => _handle.id === handleId)
        const params = { source: source.id, sourceHandle: handleId, target: target.id, targetHandle: null }

        const edge = createEdge({ ...params, label: handle?.label })

        // append edge.
        reactFlowFormat = addEdge(edge, reactFlowFormat)
    }

    function addNodeData(type, node) {
        let data = {}
        if (node.answer || node.option) {
            let messageList = []
            let transition = []
            (node.answer ?? node.option).split(",").forEach((option, index) => {
                const handleId = createTransitionId()
                const message = json[option]?.message ?? ""
                messageList = [...messageList, { value: message, id: generateUid(), handleId }]

                transition = [...transition, { id: handleId, label: `transition_${index + 1}` }]
            })

            data = {
                ...data,
                transition,
                message_type: (node?.action ?? "").toLowerCase() === "listing" ? "menu" : "buttons",
            }

            // set actions
            if (node.action) {
                data = {
                    ...data,
                    action_type: node?.action,
                }
            }

            // set messageList for LIST WIDGET
            if (type === ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type) {
                data = {
                    ...data,
                    messageList,
                }
            }
        }

        return data
    }

    // convert all widgets
    /* Object.keys(json).forEach((key, index) => {
        const node = json[key]
        const position = { x: (200 / ((index % 2) + 1)) * key, y: key * (200 / ((index % 2) + 1)) }

        const type = node.option ? ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type : ChatFlowWidgetTypes.SEND_MESSAGE_WIDGET.type

        const newNode = createNode(type, { body: node.message, key, ...addNodeData(type, node) }, position)
        // const parentNode = createEdge(newNode, node.answer)

        nodeKeyIdMap.set(key, newNode.id)
        reactFlowFormat.push(newNode)
    }) */

    /**
     *
     *
     * @param {DT Key} key
     * @param {Parent Flow Widget} parentWidget
     * @param {Parent's Transition Index} [widgetIndex=0]
     */
    function createWidget(key, parentWidget, widgetIndex = 0) {
        const node = json[key]
        const parentWidgetPos = parentWidget.position

        // position widgets by spreading them both left and right side.
        // If multiple widgets are there for a parent, then multiple the X pos.
        const posX = () => {
            const diff = 400 * (widgetIndex + 1)
            return key % 2 ? -diff : diff
        }

        // calculate the position from it's parent so they are spreaded.
        const position = {
            x: parentWidgetPos.x + posX(),
            y: parentWidgetPos.y + (key === "1" ? 100 : 500), // if initWidget, then 100
        }

        const type = node.option ? ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type : ChatFlowWidgetTypes.SEND_MESSAGE_WIDGET.type

        // TODO:: set END_OF_FLOW is both option and answer is null.

        const newNode = createNode(type, { body: node.message, key, ...addNodeData(type, node) }, position)
        // const parentNode = createEdge(newNode, node.answer)

        nodeKeyIdMap.set(key, newNode.id)
        reactFlowFormat.push(newNode)

        if (node.answer) {
            // create and add edge
            if (!nodeKeyIdMap.has(node.answer)) {
                createWidget(node.answer, newNode)
            }
        }

        if (node.option) {
            // create and add edge
            // newNode = createEdge(newNode, node.option)
            const options = node.option.split(",")
            options.forEach((option, optionIndex) => {
                if (!nodeKeyIdMap.has(option)) {
                    createWidget(option, newNode, optionIndex)
                }
            })
        }
    }

    // Init the flow.
    const InitWidgetNode = addNodeData(ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type, { answer: "1" })
    const InitWidget = createNode(ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type, InitWidgetNode, { x: 714, y: 65 })
    reactFlowFormat = [InitWidget]
    nodeKeyIdMap.set("0", InitWidget.id)
    createWidget("1", reactFlowFormat[0])

    // add edge for Init Widget
    addEdgeData("0", "1", 0)

    // add all edges
    Object.keys(json).forEach((key, index) => {
        const node = json[key]

        // if a node is part of the flow.
        if (!nodeKeyIdMap.get(key)) {
            return
        }
        if (node.answer) {
            // create and add edge
            addEdgeData(key, node.answer, 0)
        }

        if (node.option) {
            // create and add edge
            // newNode = createEdge(newNode, node.option)
            const options = node.option.split(",")
            options.forEach((option, optionIndex) => {
                addEdgeData(key, option, optionIndex)
            })
        }
    })

    return { elements: reactFlowFormat, position: [326.7943651940301, 4.365482507512354], zoom: 0.5 }
}

/**
 * Convert flowchart data to decision tree
 *
 * @export
 * @param {FlowChartData} flowData
 * @return {null|Object}
 */
export function convertFlowToDecisionTreeFlow(flowData) {
    function getBody(widget) {
        return widget?.data?.body
    }

    function getActionType(widget) {
        if (widget?.data?.message_type === "menu") {
            return "listing"
        }
        if (widget?.data?.action_type) {
            return widget?.data?.action_type
        }
        return null
    }

    let decisionTree = {}
    let start = 1
    const isError = false

    // Get the CHAT_TRIGGER_WIDGET Node to init.
    const ChatTrigger = findObjectByType("type", ChatFlowWidgetTypes.CHAT_TRIGGER_WIDGET.type, flowData.elements)
    const ChatTriggerChild = getOutgoers(ChatTrigger, flowData.elements)?.[0]

    // create IDs for each widget.
    // map the widget at option
    // pass the parentId and a flag if parent is a List type.
    function traverse(widget, parentId, isParentList = false) {
        const childWidgets = getOutgoers(widget, flowData.elements)

        if (childWidgets) {
            let isListType = false
            if (widget.type === ChatFlowWidgetTypes.LIST_MESSAGE_WIDGET.type) {
                isListType = true
            }

            const levelId = start

            const level = {
                message: getBody(widget),
                option: null,
                answer: null, // either answer or option.
                timeout: null, // by default 1,
                action: getActionType(widget), // listing & Notification
            }

            // Update the `option` value in the parent widget.
            if (parentId) {
                if (isParentList) {
                    const parentIds = decisionTree[parentId].option
                    if (parentIds !== null) {
                        decisionTree[parentId].option = [...parentIds.split(","), start].toString()
                    } else {
                        decisionTree[parentId].option = `${start}`
                    }
                } else {
                    decisionTree[parentId].answer = `${start}`
                }
                decisionTree[parentId].timeout = "1"
            }

            decisionTree = {
                ...decisionTree,
                [start]: level,
            }
            start++

            childWidgets.forEach(_widget => {
                if (isError) {
                    return
                }
                traverse(_widget, levelId, isListType)
            })
        }
    }

    if (ChatFlowWidgetTypes) {
        // initiate traversing
        traverse(ChatTriggerChild, null)
    }

    if (isError) {
        return null
    }

    return decisionTree
}

export function removeFlowChartElements(elementsToRemove, localDispatch, flowData) {
    localDispatch(setEditWidget(0, null))
    localDispatch(setFlowChartData(removeElements(elementsToRemove, flowData)))

    elementsToRemove.forEach(_elToRem => {
        // Remove parentId from nodes when an Edge is removed
        if (_elToRem.type === "step") {
            localDispatch(updateFlowChartData(_elToRem.target, "parentId", null))
        }
    })
}
