import { DaysOfWeek, WeekData, daysOfWeek } from "@/app/sobie/types";
import classNames from "classnames";
import React, { Children, useState } from "react";
import Select from "react-select";
import { Colors, getAttrs } from "./text";
const labelClass = "block mb-2 text-sm text-[#e81727] font-bold font-serif";
const inputClass = "bg-gray-50 border dark:bg-gray-800 dark:text-white border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

type InputExtensionProps = {
    children: string | string[],
    labelClassName?: string,
    labelProps?: React.HTMLProps<HTMLLabelElement>
    divClassName?: string,
    divProps?: React.HTMLProps<HTMLDivElement>
    dispatch: (value: string) => any
}

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, "children" | "onChange"> & InputExtensionProps
/**
 * <Input type="number" pattern="">Title of Input</Input>
 * @param  
 * @returns 
 */
export function Input({ labelClassName, labelProps, divClassName, divProps, className, children, dispatch, ...props }: InputProps) {
    const labelCls = classNames(labelClass, labelClassName)
    const inputCls = classNames(inputClass, className);
    return (
        <div className={divClassName} {...divProps}>
            <label className={labelCls} {...labelProps}>{children}</label>
            <input className={inputCls} onChange={e => dispatch(e.target.value)} {...props} />
        </div>
    )
}

type CheckboxProps = Omit<InputProps, "checked"|"value"|"dispatch"> & {
    value: boolean,
    dispatch: (value: boolean) => any
};
export function Checkbox({ labelClassName, value, labelProps, divClassName, divProps, className, children, dispatch, ...props }: CheckboxProps) {
    const labelCls = classNames("ms-2 text-sm font-bold text-gray-900 dark:text-gray-300", labelClassName);
    const inputCls = classNames("w-4 h-4 text-[#e81727] bg-gray-100 border-gray-300 rounded focus:ring-[#e81727] dark:focus:ring-[#e81727] accent-[#e81727] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600", className);
    const divCls = classNames("flex items-center", divClassName);
    return (
        <div className={divCls} onClick={() => dispatch(!value)} {...divProps}>
            <input type="checkbox" checked={value} className={inputCls} {...props} />
            <label className={labelCls} {...labelProps}>{children}</label>
        </div>
    )
}

type TextareaProps = Omit<React.HTMLProps<HTMLTextAreaElement>, "children" | "onChange"> & InputExtensionProps
/**
 * <Input type="number" pattern="">Title of Input</Input>
 * @param  
 * @returns 
 */
export function Textarea({ labelClassName, labelProps, divClassName, divProps, className, children, dispatch, ...props }: TextareaProps) {
    const labelCls = classNames(labelClass, labelClassName)
    const inputCls = classNames(inputClass, className);
    return (
        <div className={divClassName} {...divProps}>
            <label className={labelCls} {...labelProps}>{children}</label>
            <textarea className={inputCls} onChange={e => dispatch(e.target.value)} {...props} />
        </div>
    )
}


type OuterSelectProps = Omit<InputExtensionProps, "children" | "className" | "dispatch"> & { children: any, label: string }
export function OuterSelect({ label, labelClassName, labelProps, divClassName, divProps, children, }: OuterSelectProps) {
    const labelCls = classNames(labelClass, labelClassName)
    return (
        <div className={divClassName} {...divProps}>
            <label className={labelCls} {...labelProps}>{label}</label>
            {children}
        </div>
    )
}

type InputGroupProps = React.HTMLProps<HTMLDivElement>;
/**
 * <InputGroup>
 *  <Input>Left Input</Input>
 *  <Input>Right Input</Input>
 * </InputGroup>
 * @param 
 * @returns 
 */
export function InputGroup({ className, children, ...props }: InputGroupProps) {
    const cols = ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4", "grid-cols-5", "grid-cols-6", "grid-cols-7", "grid-cols-8", "grid-cols-9", "grid-cols-10", "grid-cols-11", "grid-cols-12"];
    const divClass = classNames(`grid ${cols[Children.count(children) - 1]} gap-4 `, className);
    return (
        <div className={divClass} {...props}>
            {children}
        </div>
    )
}


type WeekPickerDayProps = {
    onClick: (day: string) => any,
    day: string,
    active?: boolean
}
function WeekPickerDay({ onClick, day, active }: WeekPickerDayProps) {
    const activeColor = Colors.red["!bg"];
    let weekClass = classNames("relative select-none hover:cursor-pointer w-8 h-8 bg-gray-100 dark:bg-gray-500 dark:text-white rounded-full flex justify-center items-center text-center p-4 shadow-md", {
        "hover:bg-red-200 dark:hover:bg-red-500": !active,
    });
    if (active) weekClass += " " + activeColor;
    return (
        <div className={weekClass} onClick={() => onClick(day)}>
            <span className="">
                {day}
            </span>
        </div>
    );
}

type InnerWeekPickerProps = Omit<React.HTMLProps<HTMLDivElement>, "children"|"value"|"onChange"> & {
    onChange: (v: WeekData<boolean>) => any,
    value: WeekData<boolean>
};

function InnerWeekPicker({ onChange, value, ...props }: InnerWeekPickerProps) {
    const abbr = ["Su", "M", "T", "W", "Th", "F", "Sa"];
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;
    const changeState = (day: string) => {
        const newValue = {...value};
        const fullDay = days[abbr.findIndex(x => x === day)];
        newValue[fullDay] = !newValue[fullDay];
    
        onChange(newValue);
    };

    return (
        <div {...props}>
            {["Su", "M", "T", "W", "Th", "F", "Sa"].map((x, idx) => (
                <WeekPickerDay onClick={changeState} day={x} active={value[days[idx]]} />
            ))}
        </div>
    )
}


type WeekPickerProps = InnerWeekPickerProps & Omit<InputExtensionProps, "dispatch">;
export function WeekPicker({ labelClassName, labelProps, divClassName, divProps, className, children, value, onChange, ...props }: WeekPickerProps) {
    const labelCls = classNames(labelClass, labelClassName)
    const inputClass = classNames("bg-gray-50 dark:bg-gray-800 border justify-between dark:text-white text-gray-900 text-xl rounded-lg block w-full p-2.5 flex", className);
    return (
        <div className={divClassName} {...divProps}>
            <label className={labelCls} {...labelProps}>{children}</label>
            <InnerWeekPicker className={inputClass} onChange={onChange} value={value} {...props} />
        </div>
    )
}

type InputSectionProps = React.HTMLProps<HTMLDivElement>
export function InputSection({className, ...props}: InputSectionProps) {
    return <div className={classNames("mx-auto p-5 w-11/12 lg:w-7/12 border rounded-xl shadow-2xl", className)}  {...props}/>
}