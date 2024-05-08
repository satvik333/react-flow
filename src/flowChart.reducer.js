import * as Actions from "./actions"

export const initialState = {
    flow: [
        {
            id: "dndnode_1",
            type: "CHAT_TRIGGER_WIDGET",
            position: { x: 700, y: 30 },
            selectable: false, // Disables DELETE on this widget.
            data: { label: "CHAT_TRIGGER_WIDGET", transition: [{ id: "handle_trigger", label: "transition_1" }], action_name: "Trigger" },
        },
    ],
    globalVariables: {
        $customer: {
            available: false,
        },
        $order: {
            available: false,
        },
    },
}

const flowChartReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.RESET_FLOW_CHART: {
            return initialState
        }
        case Actions.SET_FLOW_CHART: {
            return {
                ...state,
                flow: [...action.data],
            }
        }
        case Actions.SET_ACTIVE_EDIT_WIDGET: {
            return {
                ...state,
                currentWidgetId: action.id,
                currentWidgetType: action.widgetType,
            }
        }
        case Actions.UPDATE_FLOW_CHART_CONFIG: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowData => {
                        if (_flowData.id === action.id) {
                            return {
                                ..._flowData,
                                [action.dataType]: action.data,
                            }
                        }
                        return _flowData
                    }),
                ],
            }
        }
        case Actions.UPDATE_FLOW_CHART_DATA: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowData => {
                        if (_flowData.id === action.id) {
                            return {
                                ..._flowData,
                                data: {
                                    ..._flowData.data,
                                    [action.dataType]: action.data,
                                },
                            }
                        }
                        return _flowData
                    }),
                ],
            }
        }

        case Actions.UPDATE_FLOW_CHART_VARS: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowData => {
                        if (_flowData.id === action.nodeId) {
                            return {
                                ..._flowData,
                                data: {
                                    ..._flowData.data,
                                    variables: {
                                        ..._flowData.data.variables,
                                        [action.variableKey]: action.variableName,
                                    },
                                },
                            }
                        }
                        return _flowData
                    }),
                ],
            }
        }
        case Actions.SET_FLOW_CHART_VARS: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowData => {
                        if (_flowData.id === action.nodeId) {
                            return {
                                ..._flowData,
                                data: {
                                    ..._flowData.data,
                                    variables: {
                                        ...action.variables,
                                    },
                                },
                            }
                        }
                        return _flowData
                    }),
                ],
            }
        }

        case Actions.ADD_TRANSITION_FLOW_CHART: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowItem => {
                        // remove transition from Widget Data
                        if (_flowItem.id === action.widgetId) {
                            return {
                                ..._flowItem,
                                data: {
                                    ..._flowItem.data,
                                    transition: [
                                        ...(_flowItem?.data?.transition ?? []),
                                        {
                                            id: action.id,
                                            label: `transition_${((_flowItem?.data?.transition ?? [])?.length ?? 0) + 1}`,
                                        },
                                    ],
                                },
                            }
                        }
                        return _flowItem
                    }),
                ],
            }
        }
        case Actions.REMOVE_TRANSITION_FLOW_CHART: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowItem => {
                        // remove transition from Widget Data
                        if (_flowItem.id === action.widgetId) {
                            return {
                                ..._flowItem,
                                data: {
                                    ..._flowItem.data,
                                    transition: _flowItem.data.transition.filter(_trans => _trans.id !== action.transitionId),
                                },
                            }
                        }
                        return _flowItem
                    }),
                ],
            }
        }
        case Actions.UPDATE_EDGE_FLOW_CHART: {
            return {
                ...state,
                flow: [
                    ...state.flow.map(_flowItem => {
                        // remove transition from Widget Data
                        if (_flowItem.id === action.edgeId) {
                            return {
                                ..._flowItem,
                                [action.dataKey]: action.value,
                            }
                        }
                        return _flowItem
                    }),
                ],
            }
        }
        default: {
            return state
        }
    }
}

export default flowChartReducer
