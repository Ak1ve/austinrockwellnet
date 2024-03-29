// type 

import { WeekData } from "../types"

export type MeetingTime = {
    title: string,
    location: string,
    days: WeekData<boolean>,
    startTime: string,
    endTime: string,
    description: string
}

export type RecurringAssignment = {
    type: "recurring",
    title: string,
    description: string,
    days: WeekData<boolean>,
}

export type SingleAssignment = {
    type: "single",
    title: string,
    description: string,
    date: Date
}

export type Class = {
    /** When the classes are in session */
    classTimes: MeetingTime[],
    /** When the professor has office hours */
    officeHourTimes: MeetingTime[],
    /** When (if) there are tutoring times */
    tutoringTimes: MeetingTime[],
    /** The assignments in the class */
    singleAssignments: string,
    recurringAssignments: RecurringAssignment[]
    /** Name of the class e.g. Introduction To Psychological Science */
    name: string,
    /** DEPT ### e.g. PSYCH 100 */
    course: string,
    /** This can be autofilled */
    finalExam: {
        date: string,
        location: string,
        startTime: string,
        endTime: string,
        description: string,
    }
};

export type Break = {
    startDate: string,
    endDate: string,
    breakName: string
};

export type CalendarData = {
    classes: Class[],
    academicCalendar: {
        breakTimes: Break[],
        semesterStart: string,
        semesterEnd: string,
        readingPeriod: {
            startDate: string,
            endDate: string
        },
    },
    options: {
        /** If a class is meeting during a break, is not included */
        removeClassesOnBreaks: boolean,
        /** If office hours is meeting during a break, is not included */
        removeOfficeHoursOnBreaks: boolean,
        /** If tutoring is meeting during a break, is not included */
        removeTutoringOnBreaks: boolean,
        /** If there is an assignment on a break, is not included */
        removeAssignmentsOnBreaks: boolean,
        /** If a class has already happened before the day of export, don't include in calendar */
        removePastEvents: boolean,
    }
}

export type CRNLookupResponse = {
    fmt: {
        meetingTime: WeekData<boolean> & {
            beginTime: string | null, // XXXX
            endTime: string | null, // XXXX
            building: string | null,
            buildingDescription: string | null,
            category: string | null,
            room: string | null,
        }
    }[]
}

export type CRNDetailsResponse = {
    courseNumber: string,
    courseTitle: string,
    sectionNumber: string,
    subject: string
}

export type AcademicCalendarResponse = {
    currentTerm: string,
    semesterStart: string,
    semesterEnd: string,
    readingPeriodStart: string,
    readingPeriodEnd: string,
    breaks: CalendarData["academicCalendar"]["breakTimes"],
    finals: Record<string, string>
}

export const CRNLookupPracticeResponse = {
    "fmt": [
        { "category": "02", "class": "net.hedtech.banner.student.schedule.SectionSessionDecorator", "courseReferenceNumber": "27141", "faculty": [{ "bannerId": "56080", "category": "02", "class": "net.hedtech.banner.student.faculty.FacultyResultDecorator", "courseReferenceNumber": "27141", "displayName": "McCarrin, Michael", "emailAddress": "mmccarri@oberlin.edu", "primaryIndicator": false, "term": "202402" }], "meetingTime": { "beginTime": "1430", "building": "KING", "buildingDescription": "King Building", "campus": "M", "campusDescription": null, "category": "02", "class": "net.hedtech.banner.general.overall.MeetingTimeDecorator", "courseReferenceNumber": "27141", "creditHourSession": 4.0, "endDate": "05/19/2024", "endTime": "1620", "friday": false, "hoursWeek": 1.83, "meetingScheduleType": "C", "meetingType": "CLAS", "meetingTypeDescription": "Class", "monday": false, "room": "137", "saturday": false, "startDate": "02/05/2024", "sunday": false, "term": "202402", "thursday": false, "tuesday": false, "wednesday": true }, "term": "202402" },
        {
            "category": "01", "class": "net.hedtech.banner.student.schedule.SectionSessionDecorator", "courseReferenceNumber": "27141", "faculty": [{ "bannerId": "56080", "category": "01", "class": "net.hedtech.banner.student.faculty.FacultyResultDecorator", "courseReferenceNumber": "27141", "displayName": "McCarrin, Michael", "emailAddress": "mmccarri@oberlin.edu", "primaryIndicator": true, "term": "202402" }],
            "meetingTime": { "beginTime": "0900", "building": null, "buildingDescription": null, "campus": null, "campusDescription": null, "category": "01", "class": "net.hedtech.banner.general.overall.MeetingTimeDecorator", "courseReferenceNumber": "27141", "creditHourSession": 0.0, "endDate": "05/19/2024", "endTime": "0950", "friday": true, "hoursWeek": 2.5, "meetingScheduleType": "C", "meetingType": "CLAS", "meetingTypeDescription": "Class", "monday": true, "room": null, "saturday": false, "startDate": "02/05/2024", "sunday": false, "term": "202402", "thursday": false, "tuesday": false, "wednesday": true }, "term": "202402"
        }
    ]
} as unknown as CRNLookupResponse;

export const CRNDetailsPracticeResponse = {"courseNumber":"150","courseTitle":"Introduction to Computer Science","sectionNumber":"01","subject":"Computer Science"};

export const AcademicCalendarPracticeResponse = {"breaks":[{"breakName":"Spring Break","endDate":"2024-03-31","startDate":"2024-03-23"}],"currentTerm":"202402","finals":{"MTRF 8:00":"2024-05-13 14:00","MTWR 8:00":"2024-05-13 14:00","MTWRF 16:00":"2024-05-13 14:00","MTWRF 16:30":"2024-05-13 14:00","MTWRF 8:00":"2024-05-13 14:00","MW 8:00":"2024-05-13 14:00","MWF 10:00":"2024-05-13 14:00","MWF 11:00":"2024-05-13 14:00","MWF 13:00":"2024-05-13 14:00","MWF 13:30":"2024-05-13 14:00","MWF 14:30":"2024-05-13 14:00","MWF 15:00":"2024-05-13 14:00","MWF 15:30":"2024-05-13 14:00","MWF 8:00":"2024-05-13 14:00","MWF 8:35":"2024-05-13 14:00","MWF 9:00":"2024-05-13 14:00","REST":"2024-05-13 14:00","TR 10:00":"2024-05-13 14:00","TR 11:00":"2024-05-13 14:00","TR 13:00":"2024-05-13 14:00","TR 13:30":"2024-05-13 14:00","TR 14:30":"2024-05-13 14:00","TR 15:00":"2024-05-13 14:00","TR 3:30":"2024-05-13 14:00","TR 8:00":"2024-05-13 14:00","TR 8:35":"2024-05-13 14:00","TR 9:00":"2024-05-13 14:00","TR 9:30":"2024-05-13 14:00","WF 8:00":"2024-05-13 14:00"},"readingPeriodEnd":"2024-05-14","readingPeriodStart":"2024-05-11","semesterEnd":"2024-05-10","semesterStart":"2024-02-05"};
