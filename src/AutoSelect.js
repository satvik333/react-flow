import React, { useEffect, useMemo, useRef } from "react"
import { Typography, TextField, MenuItem, Paper, Chip, Icon, Tooltip } from "@material-ui/core"
import classNames from "classnames"
import { FixedSizeList } from "react-window"
import TextFieldOutlinedLabel from "./TextFieldOutlinedLabel"
import Translate from "./translator"

export function NoOptionsMessage(props) {
    return (
        <Typography color="textPrimary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

export function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />
}

export function Control(props) {
    if (props.selectProps.textFieldProps.variant === "outlined-label") {
        return (
            <TextFieldOutlinedLabel
                fullWidth
                InputProps={{
                    inputComponent,
                    readOnly: props.isReadOnly,
                    inputProps: {
                        className: props?.selectProps?.classes?.input,
                        inputRef: props.innerRef,
                        readOnly: props.isReadOnly,
                        children: props.children,
                        ...props.innerProps,
                        value: props.selectProps.textFieldProps.value,
                    },
                    ...props.selectProps.inputPropsCustom,
                }}
                {...props.selectProps.textFieldProps}
            />
        )
    }

    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                readOnly: props.isReadOnly,
                inputProps: {
                    className: props?.selectProps?.classes?.input,
                    inputRef: props.innerRef,
                    readOnly: props.isReadOnly,
                    children: props.children,
                    ...props.innerProps,
                    value: props.selectProps.textFieldProps.value,
                },
                ...props.selectProps.inputPropsCustom,
            }}
            {...props.selectProps.textFieldProps}
        />
    )
}

export function Option(props) {
    delete props.innerProps.onMouseMove
    delete props.innerProps.onMouseOver

    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            <h2>{props.children}</h2>
        </MenuItem>
    )
}

export function Placeholder(props) {
    return (
        <Typography color="textPrimary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

function ValueWrapper({ tooltipChildren, children }) {
    if (typeof tooltipChildren === "string") {
        return <Tooltip title={tooltipChildren}>{children}</Tooltip>
    }
    return children
}

export function SingleValue(props) {
    return (
        <ValueWrapper tooltipChildren={props.children}>
            <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
                <h2>{props.children}</h2>
            </Typography>
        </ValueWrapper>
    )
}

export function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>
}

export function MultiValue(props) {
    return (
        <ValueWrapper tooltipChildren={props.children}>
            <Chip
                tabIndex={-1}
                label={props.children}
                className={classNames("max-w-full", props.selectProps.classes.chip, {
                    [props.selectProps.classes.chipFocused]: props.isFocused,
                })}
                onDelete={props.removeProps.onClick}
                deleteIcon={<Icon {...props.removeProps}>cancel</Icon>}
            />
        </ValueWrapper>
    )
}

export function SelectMenu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    )
}

function flattenGroupedChildren(children) {
    return children.reduce((result, child) => {
        const {
            props: { children: nestedChildren = [] },
        } = child

        return [...result, React.cloneElement(child, { type: "group" }, []), ...nestedChildren]
    }, [])
}

export function MenuList(props) {
    const children = useMemo(() => {
        const dirty_children = React.Children.toArray(props.children)
        const head = dirty_children[0] || {}
        const { props: { data: { options = [] } = {} } = {} } = head

        const groupedChildrenLength = options.length
        const isGrouped = groupedChildrenLength > 0
        const flattenedChildren = isGrouped && flattenGroupedChildren(dirty_children)

        return isGrouped ? flattenedChildren : dirty_children
    }, [props.children])
    const height = 35
    // const initialOffset = selectedValues[0] ? options.indexOf(selectedValues[0]) * height : 0

    const currentIndex = Math.max(
        children.findIndex(({ props: { isFocused } }) => {
            return isFocused === true
        }),
        0
    )

    const { innerRef, selectProps, maxHeight, getStyles } = props
    const { ...menuListStyle } = getStyles("menuList", props)

    const { classNamePrefix, isMulti } = selectProps || {}
    const list = useRef(null)

    const measuredHeights = useRef({})

    useEffect(() => {
        measuredHeights.current = {}
    }, [props.children])

    useEffect(() => {
        /**
         * enables scrolling on key down arrow
         */
        if (currentIndex >= 0 && list.current !== null) {
            list.current.scrollToItem(currentIndex)
        }
    }, [currentIndex, children, list])

    return (
        <FixedSizeList
            className={classNamePrefix ? `${classNamePrefix}__menu-list${isMulti ? ` ${classNamePrefix}__menu-list--is-multi` : ""}` : ""}
            width=""
            style={menuListStyle}
            ref={list}
            outerRef={innerRef}
            itemSize={height}
            height={maxHeight}
            itemCount={children.length}
        >
            {({ index, style }) => (
                <div className="option-wrapper" style={style}>
                    {children[index]}
                </div>
            )}
        </FixedSizeList>
    )
}
