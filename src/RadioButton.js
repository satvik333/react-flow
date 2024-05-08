import React, { memo } from "react"
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core"
import Translate from "./translator"
import clsx from "clsx"

/**
 * RadioButton component
 *
 * @param {{
 *  classes,
 *  options,
 *  label,
 *  value,
 *  onChange,
 * }} props
 *
 * classes {root,label,field}
 * options [{label,value}]
 *
 * @returns
 */
function RadioButton({ classes, options, label, value, onChange }) {
    function handleChange(evt) {
        onChange(evt.target.value)
    }

    return (
        <FormControl className={clsx(classes.root)} component="fieldset">
            <FormLabel component="legend" className={clsx(classes.label)}>
                <h2>{label}</h2>
            </FormLabel>
            <RadioGroup className={clsx("flex", classes.field)} row aria-label="Type" value={value} onChange={handleChange}>
                {options.map(_option => (
                    <FormControlLabel key={_option.value} value={_option.value} control={<Radio />} label={_option.label} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export default memo(RadioButton)
