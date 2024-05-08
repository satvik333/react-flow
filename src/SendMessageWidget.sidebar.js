import React, { lazy, memo, useEffect, useState, startTransition } from "react"
import TextField from "@material-ui/core/TextField"
import ActionType from "./ActionType"

const WidgetTextBoxIO = lazy(() => import("./WidgetEditor"))

function SendMsgWidgetSidebar({ widgetData, handleEventChange, handleChange }) {
    const editorId = `ckEditor-${String(widgetData?.id)}`
    const [defaultContent] = useState(() => widgetData?.data?.body ?? "")
    const [editorInstance, setEditorInstance] = React.useState(null)

    useEffect(() => {
        return () => {
            if (editorInstance?.content) {
                startTransition(() => {
                    const updatedBody = editorInstance?.content.get()
                    handleChange("body", updatedBody)
                });
            }
        }
    }, [editorInstance, handleChange])

    const handleFieldChange = dataKey => value => {
        handleChange(dataKey, value)
    }

    return (
        <>
            <TextField className="w-full mt-2" label="Action Name" value={widgetData?.data?.action_name} onChange={handleEventChange("action_name")} />

            <React.Suspense fallback={<div>Loading...</div>}>
                <WidgetTextBoxIO uid={editorId} content={defaultContent} onContentChange={handleFieldChange("body")} getInstance={setEditorInstance} />
            </React.Suspense>

            <ActionType widgetData={widgetData} handleChange={handleChange} />
        </>
    )
}

export default memo(SendMsgWidgetSidebar)
