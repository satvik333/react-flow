export const SET_FLOW_CHART = "[FLOW_CHART] SET_FLOW_CHART"
export const RESET_FLOW_CHART = "[FLOW_CHART] RESET_FLOW_CHART"
export const UPDATE_FLOW_CHART = "[FLOW_CHART] UPDATE_FLOW_CHART"
export const SET_FLOW_CHART_VARS = "[FLOW_CHART] SET_FLOW_CHART_VARS"
export const UPDATE_EDGE_FLOW_CHART = "[FLOW_CHART] UPDATE_EDGE_FLOW_CHART"
export const UPDATE_FLOW_CHART_DATA = "[FLOW_CHART] UPDATE_FLOW_CHART_DATA"
export const UPDATE_FLOW_CHART_VARS = "[FLOW_CHART] UPDATE_FLOW_CHART_VARS"
export const SET_ACTIVE_EDIT_WIDGET = "[FLOW_CHART] SET_ACTIVE_EDIT_WIDGET"
export const UPDATE_FLOW_CHART_CONFIG = "[FLOW_CHART] UPDATE_FLOW_CHART_CONFIG"
export const ADD_TRANSITION_FLOW_CHART = "[FLOW_CHART] ADD_TRANSITION_FLOW_CHART"
export const REMOVE_TRANSITION_FLOW_CHART = "[FLOW_CHART] REMOVE_TRANSITION_FLOW_CHART"

export function setFlowChartData(data) {
    return {
        type: SET_FLOW_CHART,
        data,
    }
}

export function resetFlowChartData() {
    return {
        type: RESET_FLOW_CHART,
    }
}

export function updateFlowChartConfig(id, dataType, data) {
    return {
        type: UPDATE_FLOW_CHART_CONFIG,
        dataType,
        data,
        id,
    }
}
export function updateFlowChartData(nodeId, dataType, data) {
    return {
        type: UPDATE_FLOW_CHART_DATA,
        dataType,
        data,
        id: nodeId,
    }
}

export function updateFlowChartVariables(nodeId, variableKey, variableName) {
    return {
        type: UPDATE_FLOW_CHART_VARS,
        nodeId,
        variableKey,
        variableName,
    }
}

export function setFlowChartVariables(nodeId, variables) {
    return {
        type: SET_FLOW_CHART_VARS,
        nodeId,
        variables,
    }
}

export function addFlowChartTransition(widgetId, id) {
    return {
        type: ADD_TRANSITION_FLOW_CHART,
        id,
        widgetId,
    }
}

export function removeFlowChartTransition(transitionId, widgetId) {
    return {
        type: REMOVE_TRANSITION_FLOW_CHART,
        transitionId,
        widgetId,
    }
}

export function updateFlowChartEdge(edgeId, dataKey, value) {
    return {
        type: UPDATE_EDGE_FLOW_CHART,
        edgeId,
        dataKey,
        value,
    }
}

/**
 * Set active editing Widget
 *
 * @export
 * @param {*} nodeId
 * @param {String} widgetType
 * @returns
 */
export function setEditWidget(nodeId, widgetType) {
    return {
        type: SET_ACTIVE_EDIT_WIDGET,
        widgetType,
        id: nodeId,
    }
}
