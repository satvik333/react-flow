import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Select, { components, createFilter } from "react-select"

import { Control, MultiValue, NoOptionsMessage, Option, SelectMenu, Placeholder, SingleValue, ValueContainer, MenuList } from "./AutoSelect"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const componentsList = {
    Control,
    Menu: SelectMenu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
    MenuList,
    Input: props => <components.Input {...props} readOnly={props.selectProps.isReadOnly} />,
}

const useStyles = makeStyles(theme => {
    const mainColor = theme.palette.background.paper

    return {
        margin: {
            margin: theme.spacing(1),
        },
        root: {
            flexGrow: 1,
        },
        input: {
            display: "flex",
            color: theme.palette.getContrastText(mainColor),
            padding: "11px 15px",
            justifyContent: "space-between",
        },
        cssLabel: {
            "&$cssFocused": {
                color: theme.palette.getContrastText(mainColor),
            },
            color: theme.palette.text.secondary,
            fontSize: "15px",
        },
        cssFocused: {},
        cssUnderline: {
            "&:after": {
                borderBottomColor: theme.palette.common.white,
            },
            borderBottomColor: theme.palette.common.white,
        },
        notchedOutline: {
            borderColor: "#fff",
        },
        cssOutlinedInput: {
            "&$cssFocused $notchedOutline": {
                borderColor: theme.palette.common.white,
            },
            "& $notchedOutline": {
                borderColor: "#fff",
            },
        },
        valueContainer: {
            display: "flex",
            flexWrap: "wrap",
            // flex: 1,
            alignItems: "center",
            width: "calc(100% - 65px)",
            // textOverflow: "ellipsis",
            // whiteSpace: "nowrap",
            // overflow: "hidden", // FIX:: Dropdown select value cuts from bottom
        },
        noOptionsMessage: {
            // padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
            padding: theme.spacing(2),
        },
        singleValue: {
            fontSize: 13,
            overflow: "hidden",
            color: theme.palette.getContrastText(mainColor),
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        placeholder: {
            position: "absolute",
            fontSize: 12,
            color: "rgba(0, 0, 0, 0.54)",
        },
        paper: {
            top: "100%",
            marginBottom: "8px",
            marginTop: "8px",
            position: "absolute",
            width: "100%",
            zIndex: "999",
            backgroundColor: "#fff",
            boxShadow: "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
        },
        chip: {
            margin: theme.spacing(0.5),
        },
        cssMultiline: {
            padding: "6px 0px",
            minHeight: "50px",
            height: "auto",
        },
        "@global": {
            ".css-b8ldur-Input": {
                margin: "0px !important",
                paddingBottom: "0px !important",
                paddingTop: "0px !important",
            },
        },
    }
})
const customStyles = {
    menuList: () => ({
        height: "auto",
        maxHeight: 200,
        minHeight: "auto",
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (styles, { isReadOnly }) => {
        return {
            ...styles,
            background: isReadOnly ? "#eee" : "",
        }
    },
    option: (styles, { isReadOnly }) => {
        return {
            ...styles,
            background: isReadOnly ? "#eee" : "",
        }
    },
}
const DefaultFormatGroupLabel = data => (
    <div className="flex items-center justify-between p-4 border-t-1 text-gray-700">
        <span className="capitalize font-600 text-13">{data.label}</span>
        <span className="text-13 font-600">{data.options.length}</span>
    </div>
)

/**
 * Props:
 * {
 *      dynamicDisableMulti: boolean --- Whether multi-selection should be disabled run-time
 *      menuPortalTarget={document.body} --- If the menu need to be displayed out of the wrapper.
 * }
 * 
 * Note:
 * Multi-selection based on Group format:
 *    [
        {
            label: "employees",
            disableMulti: true,
            options: [
                {
                    label: "Gyan",
                    value: 1222,
                    group: "employees",
                },
                {
                    label: "Ankit",
                    value: 2587924,
                    group: "employees",
                },
            ],
        }
    ]

 * All option 
    [
        {
            label: "employees",
            disableMulti: true,
            isAll: true,
            options: [
                {
                    label: "Eng",
                    value: 1222,
                    group: "employees",
                },
                {
                    label: "Temasda",
                    value: 2587924,
                },
            ],
        },
        {
            label: "queues",
            options: [
                {
                    label: "All",
                    isAll: true,
                    disableMulti: true,
                    value: 1222,2587924,548796,
                    group: "employees",
                },
                {
                    label: "Temasda",
                    value: 2587924,
                },
            ],
        }
    ]


 * @param {{dynamicDisableMulti:boolean}} props
 * @returns
 */
function SelectDropDown(props) {
    const classes = useStyles()
    const { className, onChange, dynamicDisableMulti, isMulti: isMultiProp, data, ...importedProps } = props
    const [latestOption, setLatestOption] = useState(null)
    const [isMulti, setIsMulti] = useState(isMultiProp ?? false)

    const latestOptionGroup = latestOption?.group
    const latestOptionDisableMulti = latestOption?.disableMulti

    useEffect(() => {
        if (latestOption === null) {
            // If initial value is an object then set the latest option,
            // else ignore because latestOption cannot be an array and we cannot decide which item to set as latestOption.
            if (typeof importedProps.value === "object" && !Array.isArray(importedProps?.value)) {
                setLatestOption(importedProps?.value)
            }
        }
    }, [importedProps.value, latestOption])

    // multi-selection is changed in run-time
    useEffect(() => {
        if (dynamicDisableMulti && isMultiProp && importedProps.data) {
            // Finding the Parent value
            let disableMulti = false

            // if current option has disabledMulti
            if (latestOptionDisableMulti === true) {
                disableMulti = true

                // If not, then check whether it's group has it.
            } else if (latestOptionGroup) {
                importedProps.data.forEach(group => {
                    if (group.label === latestOptionGroup) {
                        disableMulti = group?.disableMulti ?? false
                    }
                })
            }

            setIsMulti(!disableMulti)
            // if multi is disabled and different than current isMulti
            if (disableMulti && !disableMulti !== isMulti && typeof onChange === "function") {
                onChange(latestOption, { action: "set-value", option: latestOption, name: importedProps.name })
            }
        }
    }, [dynamicDisableMulti, importedProps.data, importedProps.name, isMulti, isMultiProp, latestOption, latestOptionGroup, latestOptionDisableMulti, onChange])

    function handleChange(...args) {
        if (isMulti) {
            const updatedArgs = args
            if (args?.[0]?.length > 1) {
                updatedArgs[0] = updatedArgs?.[0]?.filter(_args => _args.label !== "All")
            }
            setLatestOption(updatedArgs?.[1]?.option)
        } else {
            setLatestOption(args?.[0])
        }
        if (typeof onChange === "function") {
            onChange(...args)
        }
    }

    return (
        <Select
            options={data}
            captureMenuScroll
            menuShouldScrollIntoView
            className={clsx(className, props.isReadOnly ? "readonly-selector" : "")}
            components={componentsList}
            onChange={handleChange}
            dropDownProps={{
                className: "z-20",
            }}
            maxMenuHeight={200}
            styles={customStyles}
            menuIsOpen={props.isReadOnly ? false : props.menuIsOpen}
            backspaceRemovesValue={!props.isReadOnly}
            isClearable={!props.isReadOnly}
            textFieldProps={{
                color: "primary",
                background: "#fff",
                error: props.error,
                required: props.required,
                variant: props.variant,
                // variant : "outlined",
                name: props.name,
                value: props.value,
                multiline: isMulti,
                label: props.label,
                // helperText: props.displayName,
                InputLabelProps: {
                    classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                    },
                    shrink: true,
                },
            }}
            inputPropsCustom={{
                classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    multiline: classes.cssMultiline,
                },
            }}
            filterOption={createFilter({ ignoreAccents: false })}
            name={props.name}
            classes={classes}
            menuPlacement="auto"
            delimiter=","
            formatGroupLabel={DefaultFormatGroupLabel}
            placeholder=""
            isMulti={isMulti}
            hideSelectedOptions
            {...importedProps}
        />
    )
}

PropTypes.SelectDropDown = {
    value: PropTypes.string.isRequired,
}

export default SelectDropDown
