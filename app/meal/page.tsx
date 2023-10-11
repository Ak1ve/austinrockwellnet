"use client";
import { useEffect, useState } from "react";


function datediff(first: Date | null, second: Date | null) {
    if (first === null || second === null) {
        return 1;
    }
    return Math.round(((second as any) - (first as any)) / (1000 * 60 * 60 * 24));
}

type MealPlan = {
    name: string,
    mealSwipes: number,
    flexDollars: number,
    maxDailySwipes: number
}

const mealPlans: MealPlan[] = [
    {
        name: "GoYeo Meal Plan",
        mealSwipes: 420,
        flexDollars: 200,
        maxDailySwipes: 7
    },
    {
        name: "Gold Meal Plan",
        mealSwipes: 315,
        flexDollars: 600,
        maxDailySwipes: 5
    },
    {
        name: "Cardinal Meal Plan",
        mealSwipes: 100,
        flexDollars: 100,
        maxDailySwipes: 3
    }
]

const semesters = [
    {startDate: "2023-08-31", endDate: "2023-12-21"},
    {startDate: "2024-02-05", endDate: "2024-05-19"},
    {startDate: "2024-08-29", endDate: "2024-12-20"},
    {startDate: "2025-02-03", endDate: "2025-05-18"}
]

const labelClass = "block mb-2 text-sm font-medium text-gray-900";
const inputClass = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

export default function component() {
    const [plan, setPlan] = useState(0);
    const [swipesLeft, setSwipesLeft] = useState(mealPlans[plan].mealSwipes);
    const [flexLeft, setFlexLeft] = useState(mealPlans[plan].flexDollars)
    const [startDate, setStartDate] = useState("2023-08-31");
    const [endDate, setEndDate] = useState("2023-12-21");
    const [now, setNow] = useState(null as null | Date);
    const daysUntil = datediff(now, new Date(endDate));
    const daysSince = datediff(new Date(startDate), now);
    const currentPlan = mealPlans[plan];

    const onSelect = (x: any) => {
        const val = parseInt(x.target.value);
        setPlan(val);
        if (mealPlans.map(x => x.mealSwipes).includes(swipesLeft)) {
            setSwipesLeft(mealPlans[val].mealSwipes); // if it is a default, just fill in
        }
        if (mealPlans.map(x => x.flexDollars).includes(flexLeft)) {
            setFlexLeft(mealPlans[val].flexDollars);
        }
    }

    useEffect(() => {
        const now = new Date();
        setNow(now);
        setInterval(() => setNow(new Date()), 1000 * 60 * 60);  // every hour
        semesters.forEach(({startDate, endDate}) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (now >= start && now <= end) {
                // different semester
                setStartDate(startDate);
                setEndDate(endDate);
            }
        })
    }, [])
    if (now === null) {
        return <></>;
    }
    return (<>
        <div className="mx-auto p-5 md:w-[50%]">
            <label className={labelClass}>Select meal plan</label>
            <select onChange={onSelect} value={plan} className={inputClass}>
                {mealPlans.map((x, idx) => (
                    <option key={idx} value={idx}>{x.name}</option>
                ))}
            </select>
            <label className={labelClass + " mt-5"}>Start of Semester</label>
            <input className={inputClass} type="date" value={startDate} onChange={x => setStartDate(x.target.value)}/>
            <label className={labelClass + " mt-5"}>End of Semester</label>
            <input className={inputClass} type="date" value={endDate} onChange={x => setEndDate(x.target.value)}/>
            <div className="md:flex mt-5 justify-between">
                <div>
                    <label className={labelClass}>Meal Swipes Left</label>
                    <input className={inputClass} type="number" value={swipesLeft} onChange={x => setSwipesLeft(parseInt(x.target.value))} />
                </div>
                <div>
                    <label className={labelClass + " md:mt-0 mt-5"}>Flex Dollars Left</label>
                    <input className={inputClass} type="number" value={flexLeft} onChange={x =>setFlexLeft(parseInt(x.target.value))} />
                </div>
            </div>
            <div className="mx-auto mt-10 text-center">Future Outlook</div>
            <hr />
            You can use:
            <div className="flex justify-between">
                <div>{Math.min(swipesLeft / daysUntil, currentPlan.maxDailySwipes).toPrecision(3)} Meal Swipes</div>
                <div>{(flexLeft / daysUntil).toPrecision(3)} Flex Dollars</div>
            </div>
            Per day until the semester ends.
            
            <div className="mt-10 mx-auto text-center">Past Outlook</div>
            <hr />
            You've used an average of:
            <div className="flex justify-between">
                <div>{((currentPlan.mealSwipes - swipesLeft) / daysSince).toPrecision(3)} Meal Swipes</div>
                <div>{((currentPlan.flexDollars - flexLeft) / daysSince).toPrecision(3)} Flex Dollars</div>
            </div>
            Per day since the beginning of the semester.
        </div >
        <div className="text-sm italic">To view how many meal swipes you have left, go to your eAccounts app {">"} scroll down {">"} select the meal plan under "Board Plans" {">"} At the very top, select "this year".  This will show you how many meal swipes your plan currently has left </div>
        </>
    );
}