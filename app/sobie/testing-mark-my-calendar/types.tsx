type 

type MeetingTime = {
    days: string[], // TODO
    time: string,
    title: string,
    description: string
}

type RecurringAssignment = {
    type: "recurring",
    title: string,
    description: string,
    days: string[] // TODO
}

type SingleAssignment = {
    type: "single",
    title: string,
    description: string,
    date: Date
}

type Assignment = RecurringAssignment | SingleAssignment;

type Class = {
    /** When the classes are in session */
    classTimes: MeetingTime[],
    /** When the professor has office hours */
    officeHourTimes: MeetingTime[],
    /** When (if) there are tutoring times */
    tutoringTimes: MeetingTime[],
    /** The assignments in the class */
    assignments: Assignment[],
    /** Name of the class e.g. Introduction To Psychological Science */
    name: string,
    /** DEPT ### e.g. PSYCH 100 */
    course: string
};