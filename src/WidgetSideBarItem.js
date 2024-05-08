import { Card, Typography } from "@material-ui/core"
import React, { memo } from "react"
import { addWidgetToFlow } from "./functions.flowChart"

function WidgetSideBarItem({ name, desc, icon, type }) {
    function addWidget(evt) {
        const widgetType = type
        const data = {}
        addWidgetToFlow(widgetType, data)(evt)
    }
    return (
        <Card className="flex border-1 shadow-none cursor-move hover:shadow p-5 mt-2 items-center" onDragStart={addWidget} draggable>
            {icon}
            <div className="flex flex-col">
                <Typography variant="body1" className="text-16 font-600">
                    {name}
                </Typography>
                <Typography variant="body1" className="text-13">
                    {desc}
                </Typography>
            </div>
        </Card>
    )
}

export default memo(WidgetSideBarItem)
