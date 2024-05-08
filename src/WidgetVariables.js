import React, { useContext, useMemo } from "react"
import { Button, Icon, TextField, Typography } from "@material-ui/core"
import { generateUid } from "./library.factory"
// import CallOut from "app/main/components/general_components/CallOut"
import FlowAppContext from "./FlowAppContext"
import { ChatFlowWidgetTypes } from "./constants"
import { updateFlowChartVariables } from "./actions"

const emptyObj = {}

const WidgetVariables = () => {
    const { flowChartData, dispatch } = useContext(FlowAppContext)
    const widgetData = useMemo(() => flowChartData.flow.find(_widget => _widget.id === flowChartData.currentWidgetId), [flowChartData.currentWidgetId, flowChartData.flow])
    const widgetVarsObj = widgetData?.data?.variables ?? emptyObj

    const handleVariableRename = varKey => evt => {
        dispatch(updateFlowChartVariables(widgetData.id, varKey, evt.target.value))
    }

    const addVariables = () => {
        // set random defaultname
        dispatch(updateFlowChartVariables(widgetData.id, `custom${generateUid()}`, ""))
    }

    const widgetVarsFlat = useMemo(() => {
        let varsList = {}
        //  get all nested variables and flatten it to list it.
        function getNestedVariables(_widgetVar) {
            for (const _var in _widgetVar) {
                if (_var) {
                    if (typeof _widgetVar[_var] === "object") {
                        getNestedVariables(widgetVarsObj[_var])
                    } else {
                        varsList = {
                            ...varsList,
                            [_var]: _widgetVar[_var],
                        }
                    }
                }
            }
        }
        getNestedVariables(widgetVarsObj, {})
        return varsList
    }, [widgetVarsObj])

    return (
        <div>
            {Object.keys(widgetVarsFlat).map(_var => {
                return (
                    <div className="bg-grey-100 mt-5 p-4" key={_var}>
                        <Typography className="font-600">{_var}</Typography>
                        <TextField className="w-full mt-2" placeholder="custom variable name" value={widgetVarsFlat?.[_var]} onChange={handleVariableRename(_var)} />
                    </div>
                )
            })}
            {ChatFlowWidgetTypes?.[widgetData?.type]?.config?.isCustomVariable && (
                <Button size="small" className="capitalize font-500 mt-5 text-grey-700" onClick={addVariables}>
                    <Icon className="mr-3">add</Icon> Add Custom Variables
                </Button>
            )}
            {/* <CallOut className="absolute bottom-2" labelName="Variables are accessible in this widget's children" /> */}
        </div>
    )
}

export default WidgetVariables
