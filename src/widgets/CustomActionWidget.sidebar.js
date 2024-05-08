import React, { memo, useContext, useMemo } from "react"
import { TextField, Typography } from "@material-ui/core"
import SelectDropdown from "../SelectDropdown"
import { generateUid } from "../library.factory"
import capitalize from "lodash/capitalize"
import { JavaClassMethod } from "../constants"
import { setFlowChartVariables } from "../actions"
import FlowAppContext from "../FlowAppContext"

const availClasses = Object.keys(JavaClassMethod).map(_class => ({ label: _class, value: _class }))

function CustomActionWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const { dispatch } = useContext(FlowAppContext)

    const selectedJavaMethod = widgetData?.data?.javaMethod
    const selectedJavaClass = widgetData?.data?.javaClass

    // Set selected values in SelectDropDown format
    const selectedClassObj = useMemo(() => {
        return {
            value: selectedJavaClass,
            label: selectedJavaClass,
        }
    }, [selectedJavaClass])

    const selectedMethodObj = useMemo(() => {
        return {
            value: selectedJavaMethod,
            label: selectedJavaMethod,
        }
    }, [selectedJavaMethod])

    // Set available methods based on class selected
    const availMethods = useMemo(() => {
        return Object.keys(JavaClassMethod?.[selectedClassObj.value] ?? {}).map(_method => ({ label: _method, value: _method }))
    }, [selectedClassObj])

    function handleClassChange(val) {
        handleChange("javaClass", val.value)
    }
    function handleMethodChange(val) {
        const variables = { ...(JavaClassMethod?.[selectedJavaClass]?.[selectedJavaMethod]?.outputs ?? {}) }

        function updateNestedVariables(_widgetVar) {
            for (const _var in _widgetVar) {
                if (_var) {
                    if (typeof _widgetVar[_var] === "object") {
                        updateNestedVariables(_widgetVar[_var])
                    } else {
                        _widgetVar[_var] = `${_var}${generateUid()}`
                    }
                }
            }
        }
        updateNestedVariables(variables)
        dispatch(setFlowChartVariables(widgetData.id, variables))
        handleChange("javaMethod", val.value)
    }

    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />
            {/* <TextField className="w-full mt-2" label="Body" multiline rows={3} value={widgetData?.data?.body} onChange={handleEventChange("body")} /> */}
            <Typography className="text-14 font-700 mt-5 mb-2">Actions</Typography>
            <SelectDropdown className="w-full mt-3" label="Java Class" data={availClasses} onChange={handleClassChange} value={selectedClassObj} />
            <SelectDropdown className="w-full mt-3" label="Java Method" data={availMethods} onChange={handleMethodChange} value={selectedMethodObj} />
            {JavaClassMethod?.[selectedJavaClass]?.[selectedJavaMethod]?.inputs && (
                <>
                    <Typography className="text-14 font-700 mb-2 mt-5">Method Inputs</Typography>
                    {(JavaClassMethod?.[selectedJavaClass]?.[selectedJavaMethod]?.inputs ?? []).map(_inputField => (
                        <TextField
                            key={_inputField.key}
                            className="w-full mt-2"
                            label={capitalize(_inputField.key)}
                            value={widgetData?.data?.[_inputField.key]}
                            onChange={handleEventChange(_inputField.key)}
                        />
                    ))}
                </>
            )}
        </>
    )
}

export default memo(CustomActionWidgetSidebar)
