"use client";
import NavbarDefault from "@/components/Navbar";
import { Input, InputGroup, OuterSelect } from "@/components/inputs";
import { Footer, Highlight, Subtitle, TextBlock } from "@/components/text";
import { useEffect, useState } from "react";
import Select from "react-select";


function datediff(first: Date | null, second: Date | null) {
    if (first === null || second === null) {
        return 1;
    }
    return Math.round(((second as any) - (first as any)) / (1000 * 60 * 60 * 24));
}

const mealPlans: MealPlan[] = [
    {
        name: "GoYeo Meal Plan",
        mealSwipes: "420",
        flexDollars: "200.0",
        maxDailySwipes: 7
    },
    {
        name: "Gold Meal Plan",
        mealSwipes: "315",
        flexDollars: "600.0",
        maxDailySwipes: 5
    },
    {
        name: "Cardinal Meal Plan",
        mealSwipes: "100",
        flexDollars: "100.0",
        maxDailySwipes: 3
    }
]

const semesters = [
    { startDate: "2023-08-31", endDate: "2023-12-21" },
    { startDate: "2024-02-05", endDate: "2024-05-19" },
    { startDate: "2024-08-29", endDate: "2024-12-20" },
    { startDate: "2025-02-03", endDate: "2025-05-18" }
]


export default function component() {
    const [plan, setPlan] = useState(0);
    const [swipesLeft, setSwipesLeft] = useState(mealPlans[plan].mealSwipes);
    const [flexLeft, setFlexLeft] = useState(mealPlans[plan].flexDollars)
    const [startDate, setStartDate] = useState("2023-08-31");
    const [endDate, setEndDate] = useState("2023-12-21");

    useEffect(() => {
        fetch("https://www.austinrockwell.net/api/db/calendar").then(x => x.json()).then(x => {
            setStartDate(x.semesterStart);
            setEndDate(x.semesterEnd);
        })
    }, []);

    const [now, setNow] = useState(null as null | Date);

    const daysUntil = datediff(now, new Date(endDate));
    const daysSince = datediff(new Date(startDate), now);
    const currentPlan = mealPlans[plan];
    const onSelect = (x: any) => {
        const val = parseInt(x.value);
        setPlan(val);
        if (mealPlans.map(x => x.mealSwipes).includes(swipesLeft)) {
            setSwipesLeft(mealPlans[val].mealSwipes); // if it is a default, just fill in
        }
        if (mealPlans.map(x => x.flexDollars).includes(flexLeft)) {
            setFlexLeft(mealPlans[val].flexDollars);
        }
    }
    // <div className="font-bold font-serif"></div>
    useEffect(() => {
        const now = new Date();
        setNow(now);
        setInterval(() => setNow(new Date()), 1000 * 60 * 60);  // every hour
        semesters.forEach(({ startDate, endDate }) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (now >= start && now <= end) {
                // different semester
                setStartDate(startDate);
                setEndDate(endDate);
            }
        })
    }, []);
    let averageSwipes = Math.min(parseInt(swipesLeft) / daysUntil, currentPlan.maxDailySwipes).toPrecision(2);
    let averageFlex = (parseFloat(flexLeft) / daysUntil).toPrecision(2);
    let usedSwipes = ((parseInt(currentPlan.mealSwipes) - parseInt(swipesLeft)) / daysSince).toPrecision(2);
    let usdeFlex = ((parseFloat(currentPlan.flexDollars) - parseFloat(flexLeft)) / daysSince).toPrecision(2);

    averageSwipes = averageSwipes === "NaN" ? "0" : averageSwipes;
    averageFlex = averageFlex === "NaN" ? "0" : averageFlex;
    usedSwipes = usedSwipes === "NaN" ? "0" : usedSwipes;
    usdeFlex = usdeFlex === "NaN" ? "0" : usdeFlex;

    if (now === null) {
        return <></>;
    }
    return (<>
        <NavbarDefault active="FlexSwipe" />
        <div className="mx-auto p-5 md:w-[50%]">            
            <OuterSelect label="Select Meal Plan">
                <Select onChange={onSelect} options={mealPlans.map((x, idx) => ({value: idx.toString(), label: x.name}))} defaultValue={{label: mealPlans[0].name, value: "0"}}/>
            </OuterSelect>

            <InputGroup className="mt-5">
                <Input type="date" value={startDate} dispatch={setStartDate}>Start of Semester</Input>
                <Input type="date" value={endDate} dispatch={setEndDate}>End of Semester</Input>
            </InputGroup>
            
            <InputGroup className="mt-5">
                <Input type="number" value={swipesLeft} dispatch={setSwipesLeft}>Meal Swipes Left</Input>
                <Input type="number" pattern="^\d*(\.\d{0,2})?$" value={flexLeft} dispatch={setFlexLeft}>Flex Dollars Left</Input>
            </InputGroup>

            <Subtitle className="mt-10">Future Outlook</Subtitle>
            <hr />
            <div className="lg:grid lg:grid-cols-2 gap-5 mt-5">
                <TextBlock variant="yellow" className="mt-3 lg:mt-0">You can use {averageSwipes} meal swipes per day until the end of the semester.</TextBlock>
                <TextBlock variant="red" className="mt-3 lg:mt-0">You can use {averageFlex} flex dollars per day until the end of the semester.</TextBlock>
            </div>
            <Subtitle className="mt-10">Past Outlook</Subtitle>
            <hr />
            <div className="lg:grid lg:grid-cols-2 gap-5 mt-5">
                <TextBlock variant="red" className="mt-3 lg:mt-0">You've used {usedSwipes} meal swipes per day this semester.</TextBlock>
                <TextBlock variant="yellow" className="mt-3 lg:mt-0">You've used {usdeFlex} flex dollars per day this semester.</TextBlock>
            </div>
            <hr className="my-10"/>
            <Footer>
                To view how many meal swipes you have left, go to your eAccounts app {">"} scroll down {">"}
                select the meal plan under <Highlight>Board Plans</Highlight> {">"} At
                the very top, select <Highlight>this year</Highlight>.  This will show you how many meal swipes your plan currently has left.
            </Footer>
        </div >
    </>
    );
}