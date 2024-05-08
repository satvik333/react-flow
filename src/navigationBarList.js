import React from "react"
import Dashboard from "./icons/Dashboard"
import Leads from "./icons/Leads"
import Order from "./icons/Order"
import Customers from "./icons/Customers"
import Calender from "./icons/Calender"
import Ticket from "./icons/Ticket"
import Settings from "./icons/Settings"
import AddOn from "./icons/AddOn"
import { Icon } from "@material-ui/core"

/**
 * Navigation Bar items List
 * */
export const navigationBarList = [
    {
        title: "Dashboard",
        id: "dashboard",
        tooltip: "Dashboard ",
        url: `${process.env.PUBLIC_URL}/dashboard`,
        type: "item",
        key: "dashboard",
        icon: <Dashboard size={20} color="white" key="dashboard" />,
        privilegeId: 4,
    },
    {
        title: "Lead",
        id: "leads",
        type: "item",
        icon: <Leads size={20} color="white" key="leads" />,
        url: `${process.env.PUBLIC_URL}/leads`,
        tooltip: "Leads",
        key: "leads",
        privilegeId: 63,
    },
    {
        title: "All Orders",
        id: "allorders",
        type: "item",
        icon: <Order size={20} color="white" key="allorders" />,
        url: `${process.env.PUBLIC_URL}/allorders`,
        tooltip: "Orders",
        key: "allorders",
        privilegeId: 300,
    },
    {
        title: "Customers",
        id: "customers",
        type: "item",
        icon: <Customers size={20} color="white" key="customers" />,
        url: `${process.env.PUBLIC_URL}/customers`,
        tooltip: "Customers",
        key: "customers",
        privilegeId: 249,
    },
    {
        title: "Daily Plan",
        id: "dailyplan",
        type: "item",
        icon: <Calender size={20} color="white" key="dailyplan" />,
        url: `${process.env.PUBLIC_URL}/daily-plan`,
        tooltip: "Daily Plan",
        key: "dailyplan",
        privilegeId: 10528,
    },
    {
        title: "Tickets",
        url: `${process.env.PUBLIC_URL}/tickets`,
        id: "tickets",
        type: "item",
        key: "tickets",
        tooltip: "Tickets",
        icon: <Ticket size={20} color="white" key="tickets" />,
    },
    {
        title: "Configuration",
        id: "settings",
        type: "item",
        key: "settings",
        icon: <Settings size={20} color="white" key="configuration" />,
        url: `${process.env.PUBLIC_URL}/configurations`,
        tooltip: "Configuration",
        privilegeId: 131,
    },
    {
        title: "Add-Ons",
        id: "addons",
        type: "item",
        key: "addons",
        icon: <AddOn size={20} color="white" key="addons" />,
        url: `${process.env.PUBLIC_URL}/addons`,
        tooltip: "Add-Ons",
        privilegeId: 61,
    },

    {
        title: "Insights",
        id: "insights",
        type: "item",
        key: "insights",
        icon: <Icon className="text-20 text-white">fact_check</Icon>,
        url: `${process.env.PUBLIC_URL}/insights`,
        tooltip: "Insights",
        privilegeId: 10541,
    },
    {
        title: "Analytics",
        id: "analytics",
        type: "item",
        key: "analytics",
        icon: <Icon className="text-20 text-white">insert_chart</Icon>,
        url: `${process.env.PUBLIC_URL}/analytics`,
        tooltip: "Analytics",
        privilegeId: 131998,
    },
]

export default { navigationBarList }
