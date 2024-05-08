import React, { memo } from "react"
import { FormControl, InputBase, InputLabel, makeStyles, Tooltip, FormHelperText } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: "relative",
        backgroundColor: theme.palette.common.white,
        border: "1px solid #ced4da",
        padding: "10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        "&:focus": {
            borderColor: theme.palette.primary.main,
        },
    },
}))

function TextFieldOutlinedLabel(props) {
    const classes = useStyles()
    const otherProps = {
        ...props,
    }
    delete otherProps.variant

    const { InputProps, InputLabelProps, required, error, disabletop, helperText } = otherProps

    return (
        <FormControl className={clsx("w-full", props?.className)}>
            <Tooltip title={otherProps.label}>
                <InputLabel className="w-full truncate leading-8 text-20 font-400 text-black" shrink htmlFor={otherProps.id} required={required} error={error} {...InputLabelProps}>
                    {otherProps.label}
                </InputLabel>
            </Tooltip>
            {disabletop ? (
                <InputBase {...otherProps} {...InputProps} classes={{ input: classes.input }} />
            ) : (
                <InputBase {...otherProps} {...InputProps} classes={{ root: classes.root, input: classes.input }} />
            )}
            {/* <InputBase {...otherProps} {...InputProps} classes={{ root: classes.root, input: classes.input }} /> */}
            {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </FormControl>
    )
}

// TextFieldOutlinedLabel.muiName = TextField

export default memo(TextFieldOutlinedLabel)
