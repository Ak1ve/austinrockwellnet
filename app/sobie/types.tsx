
export const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

export type DaysOfWeek = typeof daysOfWeek[number];

export type WeekData<D> = {
    [K in DaysOfWeek]: D
}


