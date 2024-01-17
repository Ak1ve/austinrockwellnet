"use client";
import NavbarDefault from "@/components/Navbar";
import { Checkbox, Input, InputGroup, InputSection, Textarea, WeekPicker } from "@/components/inputs";
import { GoToLink, Highlight, Link, Subtitle, TextBlock, getAttrs } from "@/components/text";
import React, { ButtonHTMLAttributes, Ref, forwardRef, useEffect, useRef, useState } from "react";
import { DaysOfWeek, WeekData, daysOfWeek } from "../types";
import { AcademicCalendarPracticeResponse, AcademicCalendarResponse, Break, CRNDetailsPracticeResponse, CRNDetailsResponse, CRNLookupPracticeResponse, CRNLookupResponse, CalendarData, Class, MeetingTime, RecurringAssignment } from "./types";
import classNames from "classnames";
import { compress, decompress } from "compress-json";
import { DateArray, DurationObject, EventAttributes, NodeCallback, createEvents } from "ics";
import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
import { downloadZip } from "client-zip";
import Modal from "@/components/Modal";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

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
    const [hideMeetings, setHideMeetings] = useState(value.classTimes.length > 0);
    const [hideAssignments, setHideAssignments] = useState(value.singleAssignments.length > 0);
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
                <Input value={value.finalExam.date} dispatch={e => { prop("finalExam", "date")(e); setAdjustedFinal(true) }} type="date">Final Exam Date</Input>
                <Input value={value.finalExam.location} dispatch={e => { prop("finalExam", "location")(e); setAdjustedFinal(true) }}>Final Exam Location</Input>
            </InputGroup>
            <InputGroup>
                <Input value={value.finalExam.startTime} dispatch={e => { prop("finalExam", "startTime")(e); setAdjustedFinal(true) }} type="time">Final Exam Start Time</Input>
                <Input value={value.finalExam.endTime} dispatch={e => { prop("finalExam", "endTime")(e); setAdjustedFinal(true) }} type="time">Final Exam End Time</Input>
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
            days.push([current.getFullYear(), current.getMonth() + 1, current.getDate()]);
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
            start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
            end: [end.getFullYear(), end.getMonth() + 1, end.getDate()]
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

function downloadZipped(files: { name: string, input: string, mode: keyof Calendars }[]) {
    downloadZip(files.map(x => ({ name: x.name, input: replace(x.input, x.mode), lastModified: new Date() }))).blob().then(blob => {
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

const jumps = ["quickStart", "loadingCRN", "importing", "classStructure", "downloading", "classCode", "classStructureMeetingTime", "classStructureAssignments", "setup", "classStructureFinals"] as const;

type JumpType = {
    [key in typeof jumps[number]]: any
}

export default function f() {
    const [data, _setData] = useState<CalendarData>(newCalendarData());
    const refs = Object.fromEntries(jumps.map(x => [x, useRef(null)])) as JumpType;
    const router = useRouter();
    const query = useSearchParams();
    useEffect(() => {
        if (query.has("scrollTo")) {
            const ref = (refs as any)[query.get("scrollTo") as any] as any;
            if (ref !== undefined && ref !== null && ref.current !== null) {
                ref.current.scrollIntoView({behavior: "smooth"});
            }
        }
    }, [query]);
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
            const saved = localStorage.getItem("calendarData") === null ? newCalendarData() : JSON.parse(localStorage.getItem("calendarData")!);
            const val = { ...saved };
            val.academicCalendar.semesterStart = cal.semesterStart;
            val.academicCalendar.semesterEnd = cal.semesterEnd;
            val.academicCalendar.readingPeriod = { startDate: cal.readingPeriodStart, endDate: cal.readingPeriodEnd };
            val.academicCalendar.breakTimes = cal.breaks;
            setData(val);
        });
    }, [query.toString()]);

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
        val.academicCalendar.breakTimes = val.academicCalendar.breakTimes.filter((v, idx) => idx !== i);
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
        const names: (keyof Calendars)[] = ["academicCalendar", "assignments", "classes", "finals", "officeHours", "tutoring"];
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
                                    { name: "Academic Calendar.ics", input: academicCalendar, mode: "academicCalendar" },
                                    { name: "Assignments.ics", input: assignments, mode: "assignments" },
                                    { name: "Classes.ics", input: classes, mode: "classes" },
                                    { name: "Finals.ics", input: finals, mode: "finals" },
                                    { name: "Office Hours.ics", input: officeHours, mode: "officeHours" },
                                    { name: "Tutoring.ics", input: tutoring, mode: "tutoring" },
                                ]);

                            })
                        });
                    })
                })
            })
        });
    }

    const push = (...s: string[]) => {
        return () => {
            let n = "/sobie/mark-my-calendar";
            if (s.length > 0) {
                n += "?" + s.join("&");
            }
            router.replace(n);
        }
    };

    const link = (s: typeof jumps[number], v?: "red"|"yellow", d?: boolean) => {
        return {link: push("showHelp=1", `scrollTo=${s}`), variant: v || "red", div: d || false};
    }

    // mm/dd/yyyy
    return (<>
        <NavbarDefault active="Mark My Calendar" />
        <Modal show={query.has("showHelp")} title="Mark My Calendar Help" onExit={push()}>
            <TextBlock variant="yellow">Welcome to <Highlight variant="yellow">Mark My Calendar</Highlight>! This tool is designed to make your class schedule easier,
                allowing you to easily keep track of classes, office hours, tutoring, and assignments. Keep in mind that
                <Highlight variant="yellow"> Mark My Calendar</Highlight> is intended to be used on a computer. This tool also has not been
                tested in other timezones and will likely break if you are currently not in Oberlin's timezone.
            </TextBlock>
            <hr />
            <Subtitle variant="yellow">Table of Contents (click to jump to in guide)</Subtitle>
            <hr />
            <div className="text-center">
                    <Link {...link("quickStart", undefined, true)}>Quick-Start</Link>
                    <Link {...link("classStructure", undefined, true)}>The Class Structure</Link>
                    <Link {...link("loadingCRN", undefined, true)}>Loading from CRN</Link>
                    <Link {...link("classCode", undefined, true)}>Loading from Class Code</Link>
                    <Link {...link("downloading", undefined, true)}>Downloading Calendars</Link>
                    <Link {...link("importing", undefined, true)}>Importing into Google Calendar</Link>
                    <Link {...link("setup", undefined, true)}>Style Guide</Link>
            </div>
            <div ref={refs.quickStart} className="mt-10" />
            <Subtitle variant="yellow">Quick-Start</Subtitle>
            <hr />
            <TextBlock>This section will get you started in importing your classes quickly.</TextBlock>
            <p className="px-5">For a quick start, simply click the "<Link {...link("loadingCRN")}>Load From CRN</Link>" button and paste in a CRN number from one of your courses (e.g. 27141).
             The CRN number can be found in banner service where you registered for your classes. After entering the CRN number, press OK. This should automatically load
              the course title, and class meeting information.
             </p>
            <p className="mt-1 px-5">For adding additional meeting times, you can click "Show Meeting Times" and proceeed to click to add more meeting times regarding office hours and tutoring sessions.</p>
            <p className="mt-1 px-5">For assignments, you can either add a weekly recurring assignment or type out assignments in the following format:</p>
            <TextBlock className="ml-10">10/23 Rough Draft Due<br/>10/30 Final Draft Due</TextBlock>
            <p className="mt-1 px-5">The final exam time is automatically loaded from the exam schedule posted by Oberlin, but it may not be accurate if your class is irregular, such as CHEM 102. Double check your provided syllabus or consult
             the <a href="https://www.oberlin.edu/registrar/final-exams" target="_blank" className={getAttrs("text", "red", "underline")}>Oberlin Final Exam Schedule</a>.</p>
            <p className="mt-1 px-5">Repeat this process for your remaining classes. You are then ready to <Link {...link("downloading")}>download</Link> and <Link {...link("importing", "yellow")}>import into google calendar</Link>.</p>
            <div ref={refs.classStructure}/>
            <Subtitle variant="yellow">Class Structure</Subtitle>
            <hr />
            <TextBlock>This section will go provide in-depth details of the individul components of a class and how to utilize them effectively.</TextBlock>
            <p className="mt-1 px-5">A class has three main components: meeting times, assignments, and the final exam. We will go over them in detail:</p>
            <div ref={refs.classStructureMeetingTime}>Meeting Times</div>
            <hr />
            <p className="mt-1 px-5">A Meeting Time is any chunk of time that happens weekly and at the same time. There are three types of meeting times:
                the classes themselves, office hour sessions, and tutoring sessions.
            </p>
            <p className="mt-1 px-5">The class meeting time is where you will fill out when your classes meet. For example, let's say you are taking CSCI 150 that meets MWF 9:00am-9:50,
             and has a weekly lab meeting on mondays at 4:30pm. To add these into <Highlight variant="yellow">Mark My Calendar</Highlight>, we will add 2 meeting times. For the first one,
             we will click the "Add Class Meeting Time". It should then autofill the Class meeting Title (this can be adjusted). We will then click M, W, F to highlight the days to red.
             We will then type in 9:00am for the starting time. The end time will auto-fill with 9:50 as the class meets 3 times a week. You can then fill out the location (King 101) and description for class.
              The description is optional, but can be used to provide some quick-links, for example linking to blackboard. This process can then be repeated for the lab session. Keep in mind that manually adding class
               times is discouraged over simply <Link {...link("loadingCRN")}>loading from CRN</Link>.</p>
            <p className="mt-1 px-5">The same process can then be applied to your professor's office hours and tutoring sessions (if applicable). For the office hour descriptions, it might be useful to include an
             office hour appointment from your professor. An additional note is that when <Link {...link("importing")}>importing into google calendar</Link>, classes will automatically set your availability as "busy" during those times.
              It will not do this for office hours or tutoring</p>
            <div ref={refs.classStructureAssignments}>Assignments</div>
            <hr />
            <p className="mt-1 px-5">Assignments show up as all-day events in your google calendar. They are separated by single assignments and weekly assignments.</p>
            <p className="mt-1 px-5">Single assignments are typed out all in one textbox for ease of use. They are typed in the following format:</p>
            <TextBlock className="ml-10">10/30 Rough Draft Due<br/>11/1 Final Draft Due<br/>2/5 Really Late Semester Apparently</TextBlock>
            <p className="mt-1 px-5">These assignments will then show up as 3 events in your google calendar. It is important to note that every assignment must be a new line, and that
            the date follows the MM/DD format. A space is also required between the date and assignment title.  The assignment title will also be prefixed with the class's subject name.
             If the above assignments were apart of a Computer Science 150-01 class, then the titles will be "Computer Science 150-01 Rough Draft Due", etc.</p>
            <p className="mt-1 px-5">Weekly assignments are setup very similarly to <Link {...link("classStructureMeetingTime")}>meeting times</Link>. Simply type the name of the assignment (i.e. "Math HW Due")
             and click the days that they are due. The description can be used to provide easy links such as the blackboard link to the class. It is important to note that weekly assignments do not prefix
              the assignment with the class name. So a weekly assignment of "Math HW due" will only show up as "Math Hw due" in google calendar, not "Mathematics 220-01 Math Hw Due".</p>
            <div ref={refs.classStructureFinals}>Finals</div>
            <hr />
            <p className="mt-1 px-5">The finals section is straightfoward. It will simply look at the first <Link {...link("classStructureMeetingTime")}>class meeting time</Link>. And determine the final meeting time from
             there. Keep in mind that this process is not perfect, and it can be wrong. For example, if you filled out the lab meeting time first, then the class meeting time, it will look at the lab meeting time to determine when your final is.
            <Highlight variant="yellow"> Mark My Calendar</Highlight> will also fail at classes that are irregular. Consult your syllabus for the correct time, or look at
              the <a href="https://www.oberlin.edu/registrar/final-exams" target="_blank" className={getAttrs("text", "red", "underline")}>Oberlin Final Exam Schedule</a> for the most accurate times. It will also auto-fill the final location information
               based on the first class meeting. Double check your syllabus to ensure accurate information</p>
            <div ref={refs.loadingCRN} />
            <Subtitle variant="yellow">Loading from CRN</Subtitle>
            <hr />
            <p className="mt-1 px-5">The "Load CRN" button is designed to do some of the heavy lifting of filling out class information. Simply click the "Load CRN" button
             and paste in the CRN number (e.g. 27141). After a couple seconds (it can be a bit slow), the class will then be added with the course title, location, and class meeting times filled out.
              Double check the meeting times and ensure they are correct. The <Link {...link("classStructureFinals")}>final exam time</Link> will also be determined based on the meeting time.
              Ensure that this is accurate as well.</p>
            <div ref={refs.classCode} />
            <Subtitle variant="yellow">Loading from Class Code</Subtitle>
            <hr />
            <p className="mt-1 px-5"><Highlight variant="yellow">Mark My Calendar</Highlight> offers a easy-to-use method for sharing class information.
             If a classmate has already put in the information for CSCI 150, they can simply click the "Copy Class Code" button at the bottom of the class, then share it with you.
             Then, all you have to do is simply paste in the information after hitting the "Load Class Code" button. You will then have the class ready to <Link {...link("importing")}>import</Link>! Here is what a class code looks like: </p>
            <TextBlock variant="red" className="ml-10 break-words">[["classTimes","officeHourTimes","tutoringTimes","singleAssignments","recurringAssignments","name","course","finalExam","a|0|1|2|3|4|5|6|7","title","location","days","startTime","endTime","description","a|9|A|B|C|D|E","","Among us","monday","tuesday","wednesday","thursday","friday","saturday","sunday","a|I|J|K|L|M|N|O","b|T","b|F","o|P|Q|R|Q|R|Q|R|R","10:00","10:50","This is a class Description","o|F|G|H|S|T|U|V","a|W","a|","CSCI 150","date","a|a|A|C|D|E","2024-05-13","14:00","16:00","You have done a good job of looking at the example! Gold star for you","o|b|c|H|d|e|f","o|8|X|Y|Y|G|Y|G|Z|g"],"h"]</TextBlock>
            <p className="mt-1 px-5">It is long, but it is merely a compressed version of the underlying data that represents the class. Unfortunately, I cannot do much else without doing a lot more on the server-side of this application. In the future, I might implement this.</p>
            <div ref={refs.downloading} />
            <Subtitle variant="yellow">Downloading Calendars</Subtitle>
            <hr />
            <TextBlock>This section requires that you are on a computer.</TextBlock>
            <p className="mt-1 px-5">In order to load the classes into google calendar, you must download the calendars yourself and then <Link {...link("importing")}>import them</Link> into google calendar.
             At the bottom <Highlight variant="yellow">Mark My Calendar</Highlight> are a few options for download:</p>
             <TextBlock variant="yellow" className="ml-10"><span className="font-bold">Remove Classes on Breaks</span>: if this is checked, classes that fall on breaks during the academic calendar will be removed
             <br/><span className="font-bold">Remove Office Hours on Breaks</span>: if this is checked, office hour sessions that fall on breaks during the academic calendar will be removed
             <br/><span className="font-bold">Remove Tutoring on Breaks</span>: if this is checked, tutoring sessions that fall on breaks during the academic calendar will be removed
             <br/><span className="font-bold">Remove Events before today</span>: any event that happens before today will not show up in google calendar.
             </TextBlock>
            <p className="mt-1 px-5">Once you select your preferences, you can then download. If you only plan on <Link {...link("importing")}>importing</Link> all class information, I would recommend
             the "Download All Calendars" button. It will then download a zip file which needs to be unzipped before importing. However, if you cannot unzip, or if you only plan on using a couple calendars, you can
             do the individual downloads to download your preferences. You are now ready to <Link {...link("importing")}>import into google calendar</Link>!
             </p>
            <div ref={refs.importing} />
            <Subtitle variant="yellow">Importing into Google Calendar</Subtitle>
            <hr />
            <p className="mt-1 px-5">Now that you have downloaded your desired calendars, head to <a href="https://calendar.google.com/" target="_blank" className={getAttrs("text", "red", "underline")}>google calendar</a>.
             Under "Other Calendars" click the plus sign, then click "Import"</p>
             <img src="https://i.imgur.com/9XmGJ5d.png" title="source: imgur.com" />
            <p className="mt-1 px-5">After that, select a file (needs to be unzipped) and choose which calendar to import to.</p>
            <img src="https://i.imgur.com/cbpbVdM.png" title="source: imgur.com" />
            <p className="mt-1 px-5">The <Link {...link("setup")}>guide</Link> below explains a good setup with how to import the calendars and keep things pretty.</p>
            <div ref={refs.setup} />
            <Subtitle variant="yellow">Style Guide</Subtitle>
            <hr />
            <p className="mt-1 px-5">Keeping track of classes, office hours, tutoring, the academic calendar, assignments and finals all in one calendar is
             incredibly dense! As such, I would recomment 3 calendars: one for school / academic calendar / finals, one for assignments, and one for tutoring / office hours like so:</p>
             <img src="https://i.imgur.com/tlDUes7.png" title="source: imgur.com" />
            <p className="mt-1 px-5">This way, you can easily toggle the less-needed information (such as tutoring and office hours), but still have access to 
            it if needed!</p>
        </Modal>
        <div className="flex justify-center w-full">
            <button className={getAttrs(["text"], "red", "underline")} onClick={push("showHelp=1")}>Click here to view a guide on how to use this tool</button>
        </div>
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
            <hr className="mb-3" />
            <div className="flex justify-center gap-5">
                <AddButton onClick={downloadAll}>Download All Calendars</AddButton>
            </div>
            <Subtitle variant="yellow" className="mt-5">Individual Download</Subtitle>
            <hr className="mb-3" />
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