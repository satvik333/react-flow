import { Icon } from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import HttpIcon from '@material-ui/icons/Http';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import MemoryIcon from '@material-ui/icons/Memory';
import FunctionsIcon from '@material-ui/icons/Functions';
import React from "react"

export const WidgetConfigTabKey = {
    data: "data",
    trigger: "triggers",
    vars: "vars",
}

export const ChatFlowWidgetTypes = {
    CHAT_TRIGGER_WIDGET: {
        name: "Trigger",
        type: "CHAT_TRIGGER_WIDGET",
        detail: "Initial triggers",
        icon: <PlayCircleOutlineIcon className="mr-5 text-green-500 text-28 animate-pulse" />,
        color: "text-green-500",
        defaultData: {
            action_name: "Trigger",
        },
    },
    END_OF_FLOW_WIDGET: {
        name: "End of Flow",
        type: "END_OF_FLOW_WIDGET",
        detail: "End of a Flow",
        disabledConfigs: [WidgetConfigTabKey.trigger, WidgetConfigTabKey.vars],
        icon: <CancelIcon className="mr-5 text-red-500 text-28 animate-pulse" />,
        color: "text-red-500",
        defaultData: {
            action_name: "End of Flow",
            body: "Thank You!",
        },
    },
    SEND_MESSAGE_WIDGET: {
        name: "Send Message",
        type: "SEND_MESSAGE_WIDGET",
        detail: "Send a message",
        icon: <ReplayIcon className="mr-5" />,
        defaultData: {
            action_name: "Welcome message",
            body: "Hey! Welcome",
        },
        /* variables: {
            reply_message: "",
        }, */
    },
    SEND_WAIT_REPLY_MESSAGE_WIDGET: {
        name: "Wait for message",
        type: "SEND_WAIT_REPLY_MESSAGE_WIDGET",
        detail: "Send and wait for a message",
        icon: <QuestionAnswerIcon className="mr-5" />,
        defaultData: {
            action_name: "Request phone no.",
            body: "Please enter your phone number.",
        },
        variables: {
            reply_message: "",
        },
    },
    LIST_MESSAGE_WIDGET: {
        name: "Select Messages",
        type: "LIST_MESSAGE_WIDGET",
        detail: "Send a list of options.",
        icon:  <ChecklistRtlIcon className="mr-5" />,
        defaultData: {
            action_name: "Select options",
            message_type: "buttons",
        },
        variables: {
            reply_message: "",
            option_selected: "",
        },
    },
    API_REQUEST_WIDGET: {
        name: "Request an API",
        type: "API_REQUEST_WIDGET",
        detail: "Perform an API request",
        icon: <HttpIcon className="mr-5" />,
        defaultData: {
            action_name: "Request orders",
            url: "https://",
        },
        variables: {
            response: "",
        },
    },
    CUSTOM_ACTION_WIDGET: {
        name: "Custom Action",
        type: "CUSTOM_ACTION_WIDGET",
        detail: "Custom action",
        icon: <SettingsEthernetIcon className="mr-5" />,
        variables: {
            $customer: "",
        },
        defaultData: {
            action_name: "Custom Action",
        },
        config: {
            isCustomVariable: true,
        },
    },
    NLP_ENGINE_WIDGET: {
        name: "NLP Engine",
        type: "NLP_ENGINE_WIDGET",
        detail: "Process data using NLP",
        icon: <MemoryIcon className="mr-5" />,
        variables: {
            response: "",
        },
        defaultData: {
            action_name: "Process orders",
        },
    },
    LOGIC_WIDGET: {
        name: "Logic Widget",
        type: "LOGIC_WIDGET",
        detail: "Add logical expressions",
        icon: <FunctionsIcon className="mr-5" />,
        defaultData: {
            action_name: "Has Orders",
        },
    },
}

export const JavaClassMethod = {
    Customer: {
        getCustomerByPhone: {
            inputs: [
                {
                    key: "phone",
                    type: "number",
                },
            ],
            outputs: {
                customer: {
                    customerId: "",
                    customerName: "",
                    phone: "",
                },
            },
            /* outputs: [
                {
                    key: "customer",
                    type: "object",
                    dataFormat: {
                        customerName: "",
                        phone: "",
                        customerId: "",
                    },
                },
            ], */
        },
        getCustomerByOrder: {
            inputs: [
                {
                    key: "phone",
                    type: "number",
                },
            ],
            outputs: {
                order: {
                    orderId: "",
                    amount: "",
                    itemName: "",
                    quantity: "",
                },
            },
        },
    },
}
