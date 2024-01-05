"use client";
import NavbarDefault from "@/components/Navbar";
import { Checkbox, Input, InputGroup, InputSection, Textarea, WeekPicker } from "@/components/inputs";
import { GoToLink, Subtitle, getAttrs } from "@/components/text";
import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import { WeekData, daysOfWeek } from "../types";
import { Break, CRNDetailsPracticeResponse, CRNDetailsResponse, CRNLookupPracticeResponse, CRNLookupResponse, CalendarData, Class, MeetingTime, RecurringAssignment } from "./types";
import classNames from "classnames";
import {compress, decompress} from "compress-json";


function addMinutes(time: string, minsToAdd: number): string {
    return new Date(new Date("1970/01/01 " + time).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function defaultLength(data: WeekData<boolean>): number {
    const selected = Object.keys(data).map(x => (data as any)[x]).filter(x => x).length;
    return [0, 110, 75, 50, 50, 50, 50, 50][selected];
}

function defaultTitle(subject: string, type: MeetingProps["type"]) {
    if (subject === "") {
        return "";
    }
    const suffix = type === "class" ? "" : type === "office" ? " - Office Hours" : type === "tutor" ? " - Tutoring" : "";
    return subject + suffix;
}

function newMeetingTime(cls: Class, type: MeetingProps["type"]): MeetingTime {
    return {
        title: "",
        location: "",
        days: Object.fromEntries(daysOfWeek.map(x => [x, false])) as WeekData<boolean>,
        startTime: "",
        endTime: "",
        description: ""
    };
}

function newRecurringAssignment(cls: Class): RecurringAssignment {
    return {
        type: "recurring",
        title: "",
        description: "",
        days: Object.fromEntries(daysOfWeek.map(x => [x, false])) as WeekData<boolean>,
    };
}

function newClass(): Class {
    return {
        classTimes: [],
        officeHourTimes: [],
        tutoringTimes: [],
        singleAssignments: "",
        recurringAssignments: [],
        name: "",
        course: "",
        finalExam: {
            date: "",
            location: "",
            startTime: "",
            endTime: "",
            description: "",
        }
    };
}

function newBreak(): Break {
    return {
        startDate: "",
        endDate: "",
        breakName: ""
    }
}

function newCalendarData(): CalendarData {
    return {
        classes: [],
        academicCalendar: {
        breakTimes: [],
        semesterStart: "",
        semesterEnd: "",
        readingPeriod: {
            startDate: "",
            endDate: ""
        },
    },
    options: {
        removeClassesOnBreaks: true,
        removeOfficeHoursOnBreaks: true,
        removeTutoringOnBreaks: false,
        removePastEvents: false
    }
    }
}


function compressClass(cls: Class): string {
    return JSON.stringify(compress(cls));
}

function decompressClass(cls: string): Class {
    try {
        return decompress(JSON.parse(cls));
    } catch {
        return newClass();
    }
}

function classFromCRN(crn: number): Promise<Class> {
    const meeting = fetch(`https://www.austinrockwell.net/api/banner/meeting/${crn}`).then(x => {
        return x.json();
    });
    const details = fetch(`https://www.austinrockwell.net/api/banner/details/${crn}`).then(x => {
        return x.json();
    })
    // const meeting = Promise.resolve(CRNLookupPracticeResponse);
    // const details = Promise.resolve(CRNDetailsPracticeResponse);

    return meeting.then((m: CRNLookupResponse) => {
        return details.then((d: CRNDetailsResponse) => {
            const cls = newClass();
            cls.name = d.courseTitle;
            cls.course = `${d.subject} ${d.courseNumber}-${d.sectionNumber}`
            cls.classTimes = m.fmt.sort((a, b) => parseInt(a.meetingTime.category!) - parseInt(b.meetingTime.category!)).map(x => ({
                title: cls.course,
                location: `${x.meetingTime.building || ""} ${x.meetingTime.room || ""}`,
                days: Object.fromEntries(daysOfWeek.map(day => [day, x.meetingTime[day]])) as WeekData<boolean>,
                startTime: x.meetingTime.beginTime?.substring(0, 2) + ":" + x.meetingTime.beginTime?.substring(2),
                endTime: x.meetingTime.endTime?.substring(0, 2) + ":" + x.meetingTime.endTime?.substring(2),
                description: ""
            }));
            return cls;
        })
    });
}


type AddButtonProps = React.HTMLProps<HTMLButtonElement>;
function AddButton({ className, ...props }: AddButtonProps) {
    return (
        <div className="flex justify-center">
            <button type={"button" as any} className={getAttrs(["text", "border"], "red", "rounded-xl font-bold border p-2 my-5")} {...props}></button>
        </div>
    );
}

type RemoveButtonProps = React.HTMLProps<HTMLButtonElement>;
function RemoveButton({ className, ...props }: RemoveButtonProps) {
    return (
        <div className="flex justify-center">
            <button type={"button" as any} className={getAttrs(["text", "border",], "yellow", "font-bold hover:underline")} {...props}></button>
        </div>
    );
}

type HideButtonProps = React.HTMLProps<HTMLButtonElement>;
function HideButton({ className, ...props }: HideButtonProps) {
    return (
        <div className="flex justify-center">
            <button type={"button" as any} className={getAttrs(["text", "border",], "red", "font-bold hover:opacity-50 my-4")} {...props}></button>
        </div>
    );
}


type MeetingProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: MeetingTime
    onChange: (val: MeetingTime) => any,
    type: "class" | "tutor" | "office",
    subject: string,
    onRemove?: () => any,
    hide?: boolean
};
function Meeting({ value, onChange, type, subject, onRemove, hide, className, ...props }: MeetingProps) {
    const [editedEnd, setEditedEnd] = useState(false);
    const [editedTitle, setEditedTitle] = useState(false);

    if (hide) {
        return <></>;
    }

    const dispatchTitle = (e: string) => {
        setEditedTitle(true);
        onChange({ ...value, title: e });
    }

    const dispatchStart = (e: string) => {
        const val = { ...value, startTime: e };
        if (!editedEnd) {
            val.endTime = addMinutes(e, defaultLength(value.days));
        }
        onChange(val);
    }

    const dispatchWeek = (e: any) => {
        const val = { ...value, days: e }
        if (!editedEnd) {
            val.endTime = addMinutes(val.startTime, defaultLength(e));
        }
        onChange(val);
    }

    const dispatchEnd = (e: string) => {
        const val = { ...value, endTime: e }
        setEditedEnd(true);
        onChange(val);
    }
    const title = type === "class" ? "Class" : type === "office" ? "Office Hours" : type === "tutor" ? "Tutoring" : "";

    return (
        <div className={classNames("px-5 lg:px-20 py-5", className)} {...props}>
            <InputGroup>
                <Input value={!editedTitle ? defaultTitle(subject, type) : value.title} dispatch={dispatchTitle}>{title} Meeting Title</Input>
                <Input value={value.location} dispatch={e => onChange({ ...value, location: e })}>{title} Meeting Location</Input>
            </InputGroup>
            <WeekPicker onChange={dispatchWeek} value={value.days}>{title} Meeting Days</WeekPicker>
            <InputGroup>
                <Input value={value.startTime} type="time" dispatch={dispatchStart}>{title} Start Time</Input>
                <Input value={value.endTime} type="time" dispatch={dispatchEnd}>{title} End Time</Input>
            </InputGroup>
            <Textarea value={value.description} dispatch={e => onChange({ ...value, description: e })}>{title} Description</Textarea>
            <RemoveButton onClick={onRemove}>Remove {title} Meeting Time</RemoveButton>
        </div>
    );
}


type RecurAssignmentProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: RecurringAssignment,
    onChange: (val: RecurringAssignment) => any,
    onRemove?: () => any,
    hide?: boolean
}
function RecurAssignment({ value, onChange, onRemove, hide, className, ...props }: RecurAssignmentProps) {
    if (hide) {
        return <></>;
    }

    const prop = (k: keyof RecurringAssignment) => {
        return (e: any) => {
            const val = { ...value };
            val[k] = e;
            onChange(val);
        };
    }

    return (
        <div className={classNames("px-5 lg:px-20 py-5", className)} {...props}>
            <Input value={value.title} dispatch={prop("title")}>Weekly Assignment Name</Input>
            <WeekPicker onChange={prop("days")} value={value.days}>Days Due</WeekPicker>
            <Textarea value={value.description} dispatch={prop("description")}>Weekly Assignment Description</Textarea>
            <RemoveButton onClick={onRemove}>Remove Weekly Assignment</RemoveButton>
        </div>
    );
}


type ClassComponentProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: Class,
    onChange: (val: Class) => any,
    onRemove?: () => any,
    hide?: boolean
}
function ClassComponent({value, onChange, onRemove, hide, className, ...props}: ClassComponentProps) {
    const [hideMeetings, setHideMeetings] = useState(false);
    const [hideAssignments, setHideAssignments] = useState(false);

    const prop = <K1 extends keyof Class, K2 extends keyof Class[K1]>(k1: K1, k2?: K2) => {
        return (e: any) => {
            const val = {...value};
            if (k2 === undefined) {
                val[k1] = e;
            } else {
                val[k1][k2] = e;
            }
            onChange(val);
        }
    }

    const newProp = <K1 extends keyof Class>(k1: K1, type?: MeetingProps["type"]) => {
        return () => {
            const obj = k1 === "recurringAssignments" ? newRecurringAssignment(value) : newMeetingTime(value, type!);
            const val = {...value};
            (val[k1] as Array<any>).push(obj);
            onChange(val);
        }
    };

    const removeProp = <K1 extends keyof Class, K2 extends keyof Class[K1]>(k1: K1, k2: K2) => {
        return () => {
            const val = {...value};
            delete val[k1][k2];
            onChange(val);
        }
    } 

    return (
        <InputSection className={classNames("my-10", className)}>
            <RemoveButton onClick={onRemove}>Remove Class</RemoveButton>
            <Input value={value.course} dispatch={prop("course")} placeholder="CSCI 151">Subject</Input>
            <Input value={value.name} dispatch={prop("name")} placeholder="Data Structures">Class Name</Input>
            <HideButton onClick={() => setHideMeetings(!hideMeetings)}>{hideMeetings ? "Show" : "Hide"} Meeting Times</HideButton>
            {value.classTimes.map((v, i) => (
                <Meeting onRemove={removeProp("classTimes", i)} key={i} value={v} onChange={prop("classTimes", i)} hide={hideMeetings} subject={value.course} type="class"/>
            ))}
            {!hideMeetings && <AddButton onClick={newProp("classTimes", "class")}>Add Class Meeting Time</AddButton>}
            {value.officeHourTimes.map((v, i) => (
                <Meeting onRemove={removeProp("officeHourTimes", i)} key={i} value={v} onChange={prop("officeHourTimes", i)} hide={hideMeetings} subject={value.course} type="office" />
            ))}
            {!hideMeetings && <AddButton onClick={newProp("officeHourTimes", "office")}>Add Office Hour Meeting Time</AddButton>}
            {value.tutoringTimes.map((v, i) => (
                <Meeting onRemove={removeProp("tutoringTimes", i)} key={i} value={v} onChange={prop("tutoringTimes", i)} hide={hideMeetings} subject={value.course} type="tutor" />
            ))}
            {!hideMeetings && <AddButton onClick={newProp("tutoringTimes", "tutor")}>Add Tutoring Meeting Time</AddButton>}
            <HideButton onClick={() => setHideAssignments(!hideAssignments)}>{hideAssignments ? "Show" : "Hide"} Assignments</HideButton>
            {
                !hideAssignments &&
                <Textarea value={value.singleAssignments} dispatch={prop("singleAssignments")} placeholder={"10/23 Rough Draft Due\n10/26 Final Draft Due"} rows={4}>Assignment Dates</Textarea>
            }
            {value.recurringAssignments.map((v, i) => (
                <RecurAssignment onRemove={removeProp("recurringAssignments", i)} key={i} value={v} onChange={prop("recurringAssignments", i)} hide={hideAssignments}/>
            ))}
            {!hideAssignments && <AddButton onClick={newProp("recurringAssignments")}>Add Weekly Recurring Assignment</AddButton>}
            <InputGroup>
                <Input value={value.finalExam.date} dispatch={prop("finalExam", "date")} type="date">Final Exam Date</Input>
                <Input value={value.finalExam.location} dispatch={prop("finalExam", "location")}>Final Exam Location</Input>
            </InputGroup>
            <InputGroup>
                <Input value={value.finalExam.startTime} dispatch={prop("finalExam", "startTime")} type="time">Final Exam Start Time</Input>
                <Input value={value.finalExam.endTime} dispatch={prop("finalExam", "endTime")} type="time">Final Exam End Time</Input>
            </InputGroup>
            <Textarea value={value.finalExam.description} dispatch={prop("finalExam", "description")}>Final Exam Description</Textarea>
            <div className="flex justify-center">
                <button className={getAttrs("text", "red", "font-bold underline hover:opacity-50")} onClick={() => {navigator.clipboard.writeText(compressClass(value))}}>Copy Class Code</button>
            </div>
        </InputSection>
    );
}

type BreakComponentProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: Break,
    onChange: (val: Break) => any,
    onRemove?: () => any,
}

function BreakComponent({value, onChange, onRemove, ...props}: BreakComponentProps) {
    const prop = <K1 extends keyof Break>(k1: K1) => {
        return (e: any) => {
            const val = {...value};
            val[k1] = e;
            onChange(val);
        }
    }

    return (
        <>
            <InputGroup>
                <Input value={value.breakName} dispatch={prop("breakName")}>Break Name</Input>
                <Input type="date" value={value.startDate} dispatch={prop("startDate")}>Start Date</Input>
                <Input type="date" value={value.endDate} dispatch={prop("endDate")}>End Date</Input>
                <RemoveButton onClick={onRemove}>Remove</RemoveButton>
            </InputGroup>
        </>
    )
}

// TODO maybe input CRN information :O
export default function f() {
    const [data, setData] = useState<CalendarData>(newCalendarData());
    const prop = <K1 extends keyof CalendarData,
     K2 extends keyof CalendarData[K1], K3 extends keyof CalendarData[K1][K2]>(k1: K1, k2?: K2, k3?: K3) => {
        return (e: any) => {
            const val = {...data};
            if (k2 === undefined) {
                val[k1] = e;
            } else if (k3 === undefined){
                val[k1][k2] = e;
            } else {
                val[k1][k2][k3] = e;
            }
            setData(val);
        }
    };

    const addClass = (x: Class) => {
        const val = {...data};
        val.classes.push(x);
        setData(val);
    }
 
    const removeClass = (i: number) => {
        const val = {...data};
        delete val.classes[i];
        setData(val);
    }

    const loadCRN = () => {
        const crn = prompt("Enter CRN number:");
        if (crn === null) {
            return;
        }
        classFromCRN(parseInt(crn!)).then(addClass);
    }

    const loadClassCode = () => {
        const code = prompt("Enter Class Code", `[["classTimes","officeHourTimes","tutoringTimes","singleAssignments","recurringAssignments","name","course","finalExam","a|0|1|2|3|4|5|6|7","a|","","date","location","startTime","endTime","description","a|B|C|D|E|F","o|G|A|A|A|A|A","o|8|9|9|9|A|9|A|A|H"],"I"]`);
        if (code === null) {
            return;
        }
        addClass(decompressClass(code!));
    }

    const addBreak = () => {
        const val = {...data};
        val.academicCalendar.breakTimes.push(newBreak());
        setData(val);
    }

    const removeBreak = (i: number) => {
        const val = {...data};
        delete val.academicCalendar.breakTimes[i];
        setData(val);

    }

    return (<>
        <NavbarDefault active="Mark My Calendar" />
        {data.classes.map((v, i) => (
            <ClassComponent key={i} value={v} onChange={prop("classes", i)} onRemove={() => removeClass(i)}/>
        ))}
        <div className="flex justify-center gap-5">
            <AddButton onClick={() => addClass(newClass())}>Add Class</AddButton>
            <AddButton onClick={loadCRN}>Load CRN</AddButton>
            <AddButton onClick={loadClassCode}>Load Class Code</AddButton>
        </div>
        <InputSection className="mt-10">
            <Subtitle className="mb-4">Academic Calendar</Subtitle>
            <InputGroup>
                <Input type="date" value={data.academicCalendar.semesterStart} dispatch={prop("academicCalendar", "semesterStart")}>Semester Start</Input>
                <Input type="date" value={data.academicCalendar.semesterStart} dispatch={prop("academicCalendar", "semesterEnd")}>Semester End</Input>
            </InputGroup>
            <InputGroup className="mt-2">
                <Input type="date" value={data.academicCalendar.readingPeriod.startDate} dispatch={prop("academicCalendar", "readingPeriod", "startDate")}>Reading Period Start</Input>
                <Input type="date" value={data.academicCalendar.readingPeriod.endDate} dispatch={prop("academicCalendar", "readingPeriod", "endDate")}>Reading Period End</Input>
            </InputGroup>
            {data.academicCalendar.breakTimes.map((v, i) => (
                <BreakComponent onRemove={() => removeBreak(i)} key={i} value={v} onChange={prop("academicCalendar", "breakTimes", i)} />
            ))}
            <AddButton onClick={addBreak}>Add Break Time</AddButton>
        </InputSection>
        <InputSection className="my-10">
            <Subtitle className="mb-4">Options And Export</Subtitle>
            <InputGroup>
                <Checkbox value={data.options.removeClassesOnBreaks} 
                    dispatch={prop("options", "removeClassesOnBreaks")}>Remove Classes on Breaks</Checkbox>
                <Checkbox value={data.options.removeOfficeHoursOnBreaks} 
                    dispatch={prop("options", "removeOfficeHoursOnBreaks")}>Remove Office Hours on Breaks</Checkbox>
                <Checkbox value={data.options.removeTutoringOnBreaks}
                    dispatch={prop("options", "removeTutoringOnBreaks")}>Remove Tutoring on Breaks</Checkbox>
            </InputGroup>
            <InputGroup className="mt-3"> 
                <Checkbox value={data.options.removePastEvents}
                    dispatch={prop("options", "removePastEvents")}>Remove Events Before Today</Checkbox>
            </InputGroup>
            <div className="flex justify-center gap-5">
                <AddButton>Download Calendars</AddButton>
                <AddButton>Email Calendars</AddButton>
            </div>
        </InputSection>
    </>
    )
}