"use client";
import NavbarDefault from "@/components/Navbar";
import { Checkbox, Input, InputGroup, InputSection, Textarea, WeekPicker } from "@/components/inputs";
import { GoToLink, Subtitle, getAttrs } from "@/components/text";
import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import { DaysOfWeek, WeekData, daysOfWeek } from "../types";
import { AcademicCalendarPracticeResponse, AcademicCalendarResponse, Break, CRNDetailsPracticeResponse, CRNDetailsResponse, CRNLookupPracticeResponse, CRNLookupResponse, CalendarData, Class, MeetingTime, RecurringAssignment } from "./types";
import classNames from "classnames";
import { compress, decompress } from "compress-json";
import { DateArray, DurationObject, EventAttributes, NodeCallback, createEvents } from "ics";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
import {downloadZip } from "client-zip";

function minutesOff(refDate?: Date) {
    return (refDate === undefined ? new Date : refDate).getTimezoneOffset();
}

function addMinutes(time: string, minsToAdd?: number, refDate?: Date): string {
    const mins = minsToAdd === undefined ? -minutesOff(refDate) : minsToAdd;
    return new Date(new Date("1970/01/01 " + time).getTime() + mins * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
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
            removeAssignmentsOnBreaks: false,
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

function classFromCRN(crn: number, academicCalendar: AcademicCalendarResponse | null): Promise<Class> {
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
            const f = cls.classTimes.length > 0 ? cls.classTimes[0] : null;
            const [finalDate, finalTime] = getMeetingTimeString(f === null ? null : f.days, f === null ? "" : f.startTime, academicCalendar);
            cls.finalExam.date = finalDate;
            cls.finalExam.startTime = finalTime;
            cls.finalExam.endTime = addMinutes(finalTime, 120);
            cls.finalExam.location = cls.classTimes[0].location;
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

function getMeetingTimeString(days: WeekData<boolean> | null, startTime: string, academicCalendar: AcademicCalendarResponse | null): [string, string] {
    if (academicCalendar === null || days == null) {
        return ["", ""];
    }
    const dayString = daysOfWeek.filter(x => days[x]).map(d => d === "thursday" ? "r" : d.charAt(0)).join("").toUpperCase();
    const entry = `${dayString} ${startTime}`;
    if (Object.hasOwn(academicCalendar.finals, entry)) {
        return academicCalendar.finals[entry].split(" ") as [string, string];
    }
    return academicCalendar.finals["REST"].split(" ") as [string, string];
}

type ClassComponentProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: Class,
    onChange: (val: Class) => any,
    onRemove?: () => any,
    hide?: boolean,
    academicCalendar: AcademicCalendarResponse | null
}
function ClassComponent({ value, onChange, onRemove, hide, className, academicCalendar, ...props }: ClassComponentProps) {
    const [hideMeetings, setHideMeetings] = useState(true);
    const [hideAssignments, setHideAssignments] = useState(true);
    const [adjustedFinal, setAdjustedFinal] = useState(false);
    const f = value.classTimes.length > 0 ? value.classTimes[0] : null;
    const [finalDate, finalTime] = getMeetingTimeString(f === null ? null : f.days, f === null ? "" : f.startTime, academicCalendar);

    const prop = <K1 extends keyof Class, K2 extends keyof Class[K1]>(k1: K1, k2?: K2) => {
        return (e: any) => {
            const val = { ...value };
            if (k2 === undefined) {
                val[k1] = e;
            } else {
                val[k1][k2] = e;
            }
            if (!adjustedFinal) {
                val.finalExam.date = finalDate;
                val.finalExam.startTime = finalTime;
                val.finalExam.location = val.classTimes.length > 0 ? val.classTimes[0].location : "";
                val.finalExam.endTime = addMinutes(finalTime, 120);
            }
            onChange(val);
        }
    }

    const newProp = <K1 extends keyof Class>(k1: K1, type?: MeetingProps["type"]) => {
        return () => {
            const obj = k1 === "recurringAssignments" ? newRecurringAssignment(value) : newMeetingTime(value, type!);
            const val = { ...value };
            (val[k1] as Array<any>).push(obj);
            onChange(val);
        }
    };

    const removeProp = <K1 extends keyof Class>(k1: K1, k2: number) => {
        return () => {
            const val = { ...value };
            (val[k1] as any) = (val[k1] as Array<any>).filter((v, idx) => idx !== k2);
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
                <Meeting onRemove={removeProp("classTimes", i)} key={i} value={v} onChange={prop("classTimes", i)} hide={hideMeetings} subject={value.course} type="class" />
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
                <RecurAssignment onRemove={removeProp("recurringAssignments", i)} key={i} value={v} onChange={prop("recurringAssignments", i)} hide={hideAssignments} />
            ))}
            {!hideAssignments && <AddButton onClick={newProp("recurringAssignments")}>Add Weekly Recurring Assignment</AddButton>}
            <InputGroup>
                <Input value={value.finalExam.date} dispatch={e=> {prop("finalExam", "date")(e); setAdjustedFinal(true)}} type="date">Final Exam Date</Input>
                <Input value={value.finalExam.location} dispatch={e => {prop("finalExam", "location")(e); setAdjustedFinal(true)}}>Final Exam Location</Input>
            </InputGroup>
            <InputGroup>
                <Input value={value.finalExam.startTime} dispatch={e => {prop("finalExam", "startTime")(e); setAdjustedFinal(true)}} type="time">Final Exam Start Time</Input>
                <Input value={value.finalExam.endTime} dispatch={e => {prop("finalExam", "endTime")(e); setAdjustedFinal(true)}} type="time">Final Exam End Time</Input>
            </InputGroup>
            <Textarea value={value.finalExam.description} dispatch={prop("finalExam", "description")}>Final Exam Description</Textarea>
            <div className="flex justify-center">
                <button className={getAttrs("text", "red", "font-bold underline hover:opacity-50")} onClick={() => { navigator.clipboard.writeText(compressClass(value)) }}>Copy Class Code</button>
            </div>
        </InputSection>
    );
}

type BreakComponentProps = Omit<React.HTMLProps<HTMLDivElement>, "children" | "value" | "onChange"> & {
    value: Break,
    onChange: (val: Break) => any,
    onRemove?: () => any,
}

function BreakComponent({ value, onChange, onRemove, ...props }: BreakComponentProps) {
    const prop = <K1 extends keyof Break>(k1: K1) => {
        return (e: any) => {
            const val = { ...value };
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

function splitTime(time: string): [number, number] {
    const [h, m] = time.split(":");
    return [parseInt(h), parseInt(m)];
}

function getMinutes(time: string): number {
    const [h, m] = splitTime(time);
    return h * 60 + m;
}

function getDuration(start: string, end: string): DurationObject {
    const s = getMinutes(start);
    const e = getMinutes(end);
    const duration = e - s;
    const hours = Math.floor(duration / 60);
    return {
        hours: hours,
        minutes: duration - hours * 60
    }
}
function parseDate(s: string): Date {
    var b = s.split(/\D/);
    return new Date(b[0] as any, --(b[1] as any), b[2] as any);
}

/**
 * Returns the first day of the week after or ON date. 
 * @param date 
 * @param dayNumber 0 is sunday, 1 is monday... 
 */
function firstDayOfWeek(date: Date, dayNumber: number): Date {
    var d = new Date(date);
    d.setDate(date.getDate() + (dayNumber + 7 - date.getDay()) % 7);
    return d;
}

function lastDayOfWeek(date: Date, dayNumber: number): Date {
    var d = new Date();
    d.setDate(date.getDate() - (7 - dayNumber + date.getDay()) % 7);
    return d;
}

function getDay(d: DaysOfWeek | string): number {
    return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].findIndex(x => x === d);
}

// https://www.npmjs.com/package/ics
function firstDay(days: WeekData<boolean>, semesterStart: string, startTime: string): DateArray {
    const firstDays = Object.entries(days).filter(v => v[1]).map(v => firstDayOfWeek(parseDate(semesterStart), getDay(v[0])));
    firstDays.sort((a: any, b: any) => a - b);
    const first = firstDays[0];
    const [hours, minutes] = splitTime(startTime);
    return [first.getFullYear(), first.getMonth() + 1, first.getDate(), hours, minutes];
}
function pad(s: string | number, length?: number): string {
    const str = s.toString();
    if (str.length < (length || 2)) {
        return "0".repeat((length || 2) - str.length) + str;
    }
    return str;
}


function rrule(data: WeekData<boolean>, endDate: string, time: string): string {
    const rules: WeekData<any> = {
        sunday: RRule.SU,
        monday: RRule.MO,
        tuesday: RRule.TU,
        wednesday: RRule.WE,
        thursday: RRule.TH,
        friday: RRule.FR,
        saturday: RRule.SA
    };
    const [year, month, day] = endDate.split("-");
    return (new RRule({
        freq: RRule.WEEKLY,
        interval: 1,
        byweekday: Object.entries(data).filter(v => v[1]).map(v => (rules as any)[v[0] as any]),
        until: datetime(parseInt(year), parseInt(month), parseInt(day), 23 - minutesOff(parseDate(endDate)) / 60),
        tzid: "America/New_York"
    })).toString().substring("RRULE:".length);
}

function daysOff(calendar: CalendarData["academicCalendar"]): [number, number, number][] {
    const days: [number, number, number][] = [];
    calendar.breakTimes.forEach(x => {
        const start = parseDate(x.startDate);
        const end = parseDate(x.endDate);
        end.setHours(23);
        let current = start;
        while (((current as any) - (end as any)) <= 0) {
            days.push([current.getFullYear(), current.getMonth() + 1, current.getDate()] as const);
            current.setDate(current.getDate() + 1);
        }
    });
    return days;
}

function getExlusions(breaks: [number, number, number][], startTime: string): DateArray[] {
    const [h, m] = splitTime(startTime);
    return breaks.map(x => [x[0], x[1], x[2], h, m]);
}

function eventsFromMeetings<K1 extends keyof Class,
    K2 extends keyof CalendarData["options"]>(cls: Class, meetingName: K1,
        defaultTitle: string, cal: CalendarData, remove: K2, breaks: [number, number, number][]): EventAttributes[] {

    const meetings = cls[meetingName] as MeetingTime[];
    const academicCalendar = cal.academicCalendar;
    const excludeBreaks = cal.options[remove] as boolean;
    const removeBeforeToday = null;
    const now = new Date();
    const start = removeBeforeToday ? `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` : academicCalendar.semesterStart;

    return meetings.map(x => ({
        title: x.title || defaultTitle,
        location: x.location,
        duration: getDuration(x.startTime, x.endTime),
        start: firstDay(x.days, start, addMinutes(x.startTime)),
        recurrenceRule: rrule(x.days, academicCalendar.semesterEnd, x.startTime),
        description: x.description,
        exclusionDates: excludeBreaks ? getExlusions(breaks, x.startTime) as any : undefined,
        transp: meetingName === "classTimes" ? "OPAQUE" : "TRANSPARENT"
    }));
}

function removePastEventList(list: EventAttributes[]): EventAttributes[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return list.filter(x => {
        const arr = x.start as DateArray;
        const d = parseDate(`${arr[0]}-${pad(arr[1])}-${pad(arr[2])}`);
        return (now as any) - (d as any) <= 0
    });
}

function constructSingleAssignments(cls: string, removeBeforeToday: boolean, assignments: string): EventAttributes[] {
    if (assignments.trim() === "") {
        return [];
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const list: EventAttributes[] = assignments.split("\n").map(x => {
        const [date, ...rest] = x.trim().split(" ");
        const [month, day] = date.split("/");
        const start = parseDate(`${now.getFullYear()}-${pad(month)}-${pad(day)}`);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        return {
            title: cls + " - " + rest.join(" "),
            start: [start.getFullYear(), start.getMonth() + 1, start.getDate()] as const,
            end: [end.getFullYear(), end.getMonth() + 1, end.getDate()] as const
        }
    });
    return removeBeforeToday ? removePastEventList(list) : list;
}

function constructRecurringAssignments(recurring: RecurringAssignment[], academicCalendar: CalendarData["academicCalendar"], removeBeforeToday: boolean): EventAttributes[] {
    const list: EventAttributes[] = recurring.map(x => ({
        title: x.title,
        start: firstDay(x.days, academicCalendar.semesterStart, "00:00"),
        recurrenceRule: rrule(x.days, academicCalendar.semesterEnd, "00:00"),
        duration: { days: 1 },
        description: x.description,
    }));
    return removeBeforeToday ? removePastEventList(list) : list;
}

function academicEvent(title: string, start: string, end: string): EventAttributes {
    const [startYear, startMonth, startDay] = start.split("-");
    const e = parseDate(end);
    e.setDate(e.getDate() + 1);
    return {
        title,
        start: [parseInt(startYear), parseInt(startMonth), parseInt(startDay)],
        end: [e.getFullYear(), e.getMonth() + 1, e.getDate()]
    };
}

type Calendars = {
    classes: EventAttributes[],
    officeHours: EventAttributes[],
    tutoring: EventAttributes[],
    assignments: EventAttributes[],
    finals: EventAttributes[],
    academicCalendar: EventAttributes[]
};

function constructCalendars(cal: CalendarData): Calendars {
    const classMeetings: EventAttributes[] = [];
    const officeHoursMeetings: EventAttributes[] = [];
    const tutoringMeetings: EventAttributes[] = [];
    const assignments: EventAttributes[] = [];
    const finals: EventAttributes[] = [];
    const academicEvents: EventAttributes[] = [];
    const breaks = daysOff(cal.academicCalendar);
    cal.classes.forEach(cls => {
        classMeetings.push(...eventsFromMeetings(cls, "classTimes", cls.course, cal, "removeClassesOnBreaks", breaks));
        officeHoursMeetings.push(...eventsFromMeetings(cls, "officeHourTimes",
            cls.course + " - Office Hours", cal, "removeOfficeHoursOnBreaks", breaks));
        tutoringMeetings.push(...eventsFromMeetings(cls, "tutoringTimes",
            cls.course + " - Tutoring", cal, "removeTutoringOnBreaks", breaks));
        assignments.push(...constructSingleAssignments(cls.course, cal.options.removePastEvents, cls.singleAssignments));
        assignments.push(...constructRecurringAssignments(cls.recurringAssignments, cal.academicCalendar, cal.options.removePastEvents));
        const [fYear, fMonth, fDay] = cls.finalExam.date.split("-");
        const [fH, fM] = splitTime(addMinutes(cls.finalExam.startTime, undefined, parseDate(cls.finalExam.date)));
        finals.push({
            title: cls.course + " - Final Exam",
            description: cls.finalExam.description,
            start: [parseInt(fYear), parseInt(fMonth), parseInt(fDay), fH, fM],
            duration: getDuration(cls.finalExam.startTime, cls.finalExam.endTime),
            location: cls.finalExam.location
        });
    })
    academicEvents.push(academicEvent("Reading Period", cal.academicCalendar.readingPeriod.startDate, cal.academicCalendar.readingPeriod.endDate));
    academicEvents.push(...cal.academicCalendar.breakTimes.map(x => academicEvent(x.breakName, x.startDate, x.endDate)));
    return {
        classes: classMeetings,
        officeHours: officeHoursMeetings,
        tutoring: tutoringMeetings,
        assignments,
        finals,
        academicCalendar: academicEvents
    }
}

function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function replace(s: string, calendarName: keyof Calendars): string {
    if (calendarName === "academicCalendar" || calendarName == "assignments") {
        return s;
    }
    return s.replace("\nDTSTART:", "\nDTSTART;TZID=America/New_York:");
}

function downloadZipped(files: {name: string, input: string, mode: keyof Calendars}[]) {
    downloadZip(files.map(x => ({name: x.name, input: replace(x.input, x.mode), lastModified: new Date()}))).blob().then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob)
        link.download = "schedule.zip";
        link.click();
        link.remove();
    });
}

function checkErr(error: any, calendarName: string): boolean {
    if (error !== undefined && error !== null) {
        alert(`There was an error in generating the calendar data for ${calendarName}. Ensure all information is entered correctly and that all fields are filled out. If this persists, contact me. Error: ${error.message}`);
        return true;
    }
    return false;
}

export default function f() {
    const [data, _setData] = useState<CalendarData>(localStorage.getItem("calendarData") === null ? newCalendarData() : JSON.parse(localStorage.getItem("calendarData")!));
    const setData = (x: any) => {
        localStorage.setItem("calendarData", JSON.stringify(x));
        _setData(x);
    }
    const [calendarData, setCalendarData] = useState(null as AcademicCalendarResponse | null);
    const prop = <K1 extends keyof CalendarData,
        K2 extends keyof CalendarData[K1], K3 extends keyof CalendarData[K1][K2]>(k1: K1, k2?: K2, k3?: K3) => {
        return (e: any) => {
            const val = { ...data };
            if (k2 === undefined) {
                val[k1] = e;
            } else if (k3 === undefined) {
                val[k1][k2] = e;
            } else {
                val[k1][k2][k3] = e;
            }
            setData(val);
        }
    };
    useEffect(() => {
        const promise = fetch("https://www.austinrockwell.net/api/db/calendar").then(x => x.json());
        // const promise = Promise.resolve(AcademicCalendarPracticeResponse);
        promise.then(cal => {
            setCalendarData(cal);
            const val = {...data};
            val.academicCalendar.semesterStart = cal.semesterStart;
            val.academicCalendar.semesterEnd = cal.semesterEnd;
            val.academicCalendar.readingPeriod = {startDate: cal.readingPeriodStart, endDate: cal.readingPeriodEnd};
            val.academicCalendar.breakTimes = cal.breaks;
            setData(val);
        });
    }, []);

    const addClass = (x: Class) => {
        const val = { ...data };
        val.classes.push(x);
        setData(val);
    }

    const removeClass = (i: number) => {
        const val = { ...data };
        val.classes = val.classes.filter((v, idx) => idx !== i);
        setData(val);
    }

    const loadCRN = () => {
        const crn = prompt("Enter CRN number:");
        if (crn === null) {
            return;
        }
        classFromCRN(parseInt(crn!), calendarData).then(addClass);
    }

    const loadClassCode = () => {
        const code = prompt("Enter Class Code");
        if (code === null) {
            return;
        }
        addClass(decompressClass(code!));
    }

    const addBreak = () => {
        const val = { ...data };
        val.academicCalendar.breakTimes.push(newBreak());
        setData(val);
    }

    const removeBreak = (i: number) => {
        const val = { ...data };
        val.academicCalendar.breakTimes =  val.academicCalendar.breakTimes.filter((v, idx) => idx !== i);
        setData(val);
    }

    const downloadCalendar = <K1 extends keyof Calendars>(name: K1) => {
        return () => {
            createEvents(constructCalendars(data)[name], (error, value) => {
                if (checkErr(error, name)) {
                    return;
                }
                download(name + ".ics", replace(value, name));
            });
        }
    }

    const downloadAll = () => {
        const cals = constructCalendars(data);
        console.log("Downloading Data:");
        console.log(data);
        const names: (keyof Calendars)[] = ["academicCalendar", "assignments", "classes", "finals", "officeHours", "tutoring"] as const;
        const wrap = (n: typeof names[number], callback: (val: string) => any) => {
            return (e: Error | undefined, value: string) => {
                if (checkErr(e, n)) return;
                callback(value);
            }
        };
        const ce = (n: typeof names[number], callback: (val: string) => any) => {
            createEvents(cals[n], wrap(n, callback));
        }
        ce("academicCalendar", (academicCalendar) => {
            ce("assignments", (assignments) => {
                ce("classes", (classes) => {
                    ce("finals", (finals) => {
                        ce("officeHours", (officeHours) => {
                            ce("tutoring", (tutoring) => {
                                downloadZipped([
                                    {name: "Academic Calendar.ics", input: academicCalendar, mode:"academicCalendar"},
                                    {name: "Assignments.ics", input: assignments, mode:"assignments"},
                                    {name: "Classes.ics", input: classes, mode:"classes"},
                                    {name: "Finals.ics", input: finals, mode:"finals"},
                                    {name: "Office Hours.ics", input: officeHours, mode:"officeHours"},
                                    {name: "Tutoring.ics", input: tutoring, mode:"tutoring"},
                                ]);

                            })
                        });
                    })
                })
            })
        });
    }

    // mm/dd/yyyy
    return (<>
        <NavbarDefault active="Mark My Calendar" />
        {data.classes.map((v, i) => (
            <ClassComponent key={i} value={v} academicCalendar={calendarData} onChange={prop("classes", i)} onRemove={() => removeClass(i)} />
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
                <Input type="date" value={data.academicCalendar.semesterEnd} dispatch={prop("academicCalendar", "semesterEnd")}>Semester End</Input>
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
            <Subtitle variant="yellow" className="mt-5">Download</Subtitle>
            <hr className="mb-3"/>
            <div className="flex justify-center gap-5">
                <AddButton onClick={downloadAll}>Download All Calendars</AddButton>
            </div>
            <Subtitle variant="yellow" className="mt-5">Individual Download</Subtitle>
            <hr className="mb-3"/>
            <div className="flex justify-center gap-5">
                <AddButton onClick={downloadCalendar("classes")}>Download Class Schedule</AddButton>
                <AddButton onClick={downloadCalendar("assignments")}>Download Assignments</AddButton>
                <AddButton onClick={downloadCalendar("academicCalendar")}>Download Academic Calendar</AddButton>
            </div>
            <div className="flex justify-center gap-5">
                <AddButton onClick={downloadCalendar("finals")}>Download Final Schedule</AddButton>
                <AddButton onClick={downloadCalendar("officeHours")}>Download Office Hours Schedule</AddButton>
                <AddButton onClick={downloadCalendar("tutoring")}>Download Tutoring Schedule</AddButton>
            </div>
        </InputSection>
    </>
    )
}