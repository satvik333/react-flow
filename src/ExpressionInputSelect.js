import React, { useMemo, useRef, useState } from "react"
import { Menu, MenuItem, TextField } from "@material-ui/core"

function ExpressionInputSelect({ value, label, onChange, inputProps, options = [] }) {
    const [anchorEl, setAnchorEl] = useState("")
    const [childVariable, setChildVariable] = useState("")
    const [currentEditIndex, setCurrentEditIndex] = useState(null)
    const textFieldRef = useRef()
    const open = Boolean(anchorEl)

    const menuOptions = useMemo(() => {
        if (!childVariable) {
            return options
        }
        return Object.keys(childVariable).map(_varKey => {
            let varLabel = childVariable[_varKey]
            if (typeof varLabel === "object") {
                varLabel = _varKey
            }
            return {
                label: varLabel,
                value: childVariable[_varKey],
            }
        })
    }, [childVariable, options])

    const handleItemSelected = item => evt => {
        // append }} and space after variable is selected.
        setChildVariable("")

        const updatedValue = `${value.slice(0, currentEditIndex) + item.value}}} ${value.slice(currentEditIndex)}`
        onChange(updatedValue)
        textFieldRef.current.focus()
        textFieldRef.current.setSelectionRange(currentEditIndex, currentEditIndex)
        setAnchorEl(null)
    }

    function handleValueChange(evt) {
        const currVal = evt.target.value
        const currPos = evt.currentTarget.selectionStart
        // const secondPrevChar = currVal[currPos - 3]
        const prevChar = currVal[currPos - 2]
        const currChar = currVal[currPos - 1]

        const prevWord = prevChar + currChar

        // close the variable
        /*  if (currChar === "}" && prevWord !== "}}") {
            const updatedValue = `${currVal.slice(0, currentEditIndex)}} ${currVal.slice(currentEditIndex)}`
            onChange(`${updatedValue}`)
        } else { */
        // open the dropdown
        if (prevWord === "{{") {
            setCurrentEditIndex(currPos)
            setAnchorEl(evt.currentTarget)
        }
        onChange(evt.target.value)
        // }
    }

    function handleClose() {
        setAnchorEl(null)
    }

    return (
        <>
            <TextField inputProps={{ ref: textFieldRef }} className="w-full mt-5" label={label} onChange={handleValueChange} value={value} {...inputProps} />
            {menuOptions && Array.isArray(menuOptions) && menuOptions.length > 0 && (
                <Menu
                    anchorEl={anchorEl}
                    getContentAnchorEl={null}
                    MenuListProps={{
                        className: "bg-gray-100 w-full",
                    }}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: 264,
                        },
                    }}
                >
                    {menuOptions.map(option => (
                        <MenuItem className="w-full" key={option.label} onClick={handleItemSelected(option)}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    )
}

export default ExpressionInputSelect
