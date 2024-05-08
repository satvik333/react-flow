import React from "react"

export default function Dashboard({
    size = 32, // or any default size of your choice
    color = "#00172B", // or any color of your choice
}) {
    return (
        <div>
            <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="22.0312" height="16.6875" rx="4" fill={color} />
                <rect x="31.9688" y="37.3123" width="22.0312" height="16.6875" rx="4" fill={color} />
                <rect x="31.9688" y="6" width="22.0312" height="28.125" rx="4" fill={color} />
                <rect x="6" y="25.875" width="22.0312" height="28.125" rx="4" fill={color} />
            </svg>
        </div>
    )
}
