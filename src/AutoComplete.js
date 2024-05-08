import React, { useCallback } from "react"
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import ListSubheader from "@material-ui/core/ListSubheader"
import { useTheme, makeStyles } from "@material-ui/core/styles"
import { VariableSizeList } from "react-window"
import { Tooltip } from "@material-ui/core"
import TextFieldOutlinedLabel from "./TextFieldOutlinedLabel"

const DefaultTextfieldProps = {
    variant: "outlined",
}
const LISTBOX_PADDING = 8 // px

function getOptionSelected(option, value) {
    return option?.value === value?.value
}

function renderRow(props) {
    const { data, index, style } = props
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    })
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef(function OuterElementType(props, ref) {
    const outerProps = React.useContext(OuterElementContext)
    return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data) {
    const ref = React.useRef(null)
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true)
        }
    }, [data])
    return ref
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props
    const itemData = React.Children.toArray(children)
    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true })
    const itemCount = itemData.length
    const itemSize = smUp ? 36 : 48

    const getChildSize = child => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48
        }

        return itemSize
    }

    const getHeight = () => {
        if (itemCount > 20) {
            return 8 * itemSize
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
    }

    const gridRef = useResetCache(itemCount)

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={index => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    )
})

const useStyles = makeStyles({
    listbox: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
    // marginAdj: {
    //     marginTop: "-24px",
    // },
    "@global": {
        ".MuiAutocomplete-hasPopupIcon .MuiAutocomplete-inputRoot": {
            paddingRight: "0px !important",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
        },
        ".MuiAutocomplete-inputRoot .MuiAutocomplete-input": {
            border: "none",
        },
    },
})

const renderGroup = params => [
    <ListSubheader key={params.key} component="div">
        {params.group}
    </ListSubheader>,
    params.children,
]

const filter = createFilterOptions()

/**
 *
 * AutoComplete DropDown
 *
 * @export
 * @typedef {label: string, value: any, group?: string} AutoCompleteOption
 * @param {{
 *      variant?: "outlined-label"|"outlined",
 *      formFieldProps?: InputFieldProps,
 *      options: AutoCompleteOption[],
 *      value?: {value: string, label: string},
 *      label: string,
 *      name: string,
 *      onChange?: Function,
 *      className?: string
 * }} props
 * @return {ReactElement}
 */
export default function AutoComplete({
    variant = "outlined",
    delimiter = ",",
    isGrouped,
    required,
    name,
    label,
    value,
    readOnly,
    disabletop,
    error,
    TextFieldProps = DefaultTextfieldProps,
    formFieldProps,
    freeSolo = false,
    ...otherProps
}) {
    // extract out Textfield related props.
    const classes = useStyles()

    function handleChange(evt, newValue) {
        if (otherProps.onChange && typeof otherProps.onChange === "function") {
            let updatedValue = newValue

            // FreeSolo
            if (typeof newValue === "string") {
                updatedValue = { label: newValue, value: newValue }
            } else if (newValue?.inputValue) {
                // Create a new value from the user input
                updatedValue = { label: newValue.inputValue, value: newValue.inputValue }
            }

            otherProps.onChange(updatedValue, evt)
        }
    }

    function getFieldValue() {
        if (otherProps.multiple && Array.isArray(value)) {
            return value.map(_value => _value.value).join(delimiter)
        }
        return value?.value ?? ""
    }

    const filterOptions = useCallback(
        (options, params) => {
            let filtered = filter(options, params)

            // Suggest the creation of a new value
            if (params.inputValue !== "" && freeSolo) {
                filtered = [
                    ...filtered,
                    {
                        inputValue: params.inputValue,
                        label: `Add "${params.inputValue}"`,
                    },
                ]
            }

            return filtered
        },
        [freeSolo]
    )

    const getOptionsLabel = useCallback(option => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
            return option
        }

        if (option.inputValue) {
            return option.inputValue
        }
        return String(option.label)
    }, [])

    const renderInput = useCallback(
        params => {
            // Textfield props passed in root of AutoComplete props
            const textFieldProps = {
                variant,
                label,
                readOnly,
                error,
                ...TextFieldProps,
                ...params,
            }

            return (
                <div ref={params.InputProps.ref}>
                    <TextFieldOutlinedLabel disabletop={disabletop} {...textFieldProps} inputProps={{ ...params.inputProps }} />
                </div>
            )
        },
        [variant, label, readOnly, error, TextFieldProps, disabletop]
    )

    return (
        <>
            <Autocomplete
                openOnFocus
                classes={classes}
                disableClearable
                renderInput={renderInput}
                getOptionLabel={getOptionsLabel}
                groupBy={isGrouped ? option => option.group : null}
                renderGroup={isGrouped ? renderGroup : null}
                filterSelectedOptions
                filterOptions={filterOptions}
                getOptionSelected={getOptionSelected}
                renderOption={option => (
                    <Tooltip title={option.label}>
                        <div className="truncate">{option.label}</div>
                    </Tooltip>
                )}
                {...otherProps}
                freeSolo={freeSolo}
                onChange={handleChange}
                value={value}
                disableListWrap
                ListboxComponent={ListboxComponent}
            />
            <input type="hidden" name={name} required={required} value={getFieldValue()} {...formFieldProps} />
        </>
    )
}
