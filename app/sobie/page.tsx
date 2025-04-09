"use client";
import NavbarDefault from "@/components/Navbar";
import { CheckerImage, Title, ObieText, GoToLink } from "@/components/text";


const SOBIE = <b className="text-[#e81727] font-serif">SOBIE</b>;
const OBIE_EATS = <b className="text-[#FFC72C] font-serif normal-case">ObieEats</b>;
const FLEX_SWIPE = <b className="text-[#e81727] font-serif normal-case">FlexSwipe</b>;
const MARK_MY_CALENDAR = <b className="text-[#FFC72C] font-serif normal-case">Mark My Calendar</b>;

const OBERLIN_IMAGE = <CheckerImage width="300" height="372" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Oberlin_College_logo.svg/1200px-Oberlin_College_logo.svg.png" />;
const MENU_IMAGE = <CheckerImage className="lg:!translate-y-0" side="left" width="150" height="" src="https://images.vexels.com/media/users/3/228656/isolated/preview/40160cf643e9bb8350e3e4e75beb3741-menu-vintage-label.png" />
const FLEX_SWIPE_IMAGE = <CheckerImage width="150" height="" src="https://cdn-icons-png.flaticon.com/512/4470/4470502.png" />;
const MARK_MY_CALENDAR_IMAGE = <CheckerImage side="left" className="lg:!translate-y-11" width="200" height="" src="https://cdn-icons-png.flaticon.com/512/5091/5091493.png" />;
const ME_IMAGE = <CheckerImage className="lg:!translate-y-11" width="200" height="" src="/me.png" />
const NOTE_BOOK_IMAGE = <CheckerImage className="lg:!translate-y-11" height="" side="left" width="200" src="https://cdn.vectorstock.com/i/preview-1x/59/72/book-notebook-cartoon-vector-46025972.jpg" />;

export default function f() {
    return (<>
        <NavbarDefault />
        <div className="lg:p-10 p-1 w-full">
            <Title>What is {SOBIE}?</Title>
            <ObieText title="Mission" image={OBERLIN_IMAGE}>
                <p className="border-l-4 border-[#e81727] pl-2">
                    {SOBIE} (Simple Oberlin) is a student-made passion project designed to make the lives of students simple and easy.
                    It is a collection of online tools that can assist you with how you navigate your classes, meals, scheduling, and more.
                    {"  "}{SOBIE} aims for the user experience, offering both useful and appealing designs in order for your time at Oberlin to be effecient and beautiful.
                </p>
            </ObieText>
            <div className="my-5" />
            <Title>Tools</Title>
            <ObieText title={OBIE_EATS} image={MENU_IMAGE} flipped>
                <p className="border-l-4 border-[#FFC72C] pl-2 mb-2">
                    Never know where to eat?  {OBIE_EATS} has you covered!
                    {"  "}{OBIE_EATS} is a simple and quick way to view dining hall information across campus for
                    any day of the week.  It pulls information from AVI's website and displays it in a simple, elegant interface.
                </p>
                <GoToLink href="sobie/menu" className="text-[#FFC72C]">Take Me to ObieEats</GoToLink>
            </ObieText>
            <hr className="w-[80%] mx-auto"/>
            <ObieText title={FLEX_SWIPE} image={FLEX_SWIPE_IMAGE}>
                <p className="border-l-4 border-[#e81727] pl-2 mb-2">
                    Have you ever ran out of meal swipes or flex dollars by the end of the semester? {FLEX_SWIPE} can help!  This tool is
                    a simple calculator that lets you know how many meal swipes / flex dollars you can use each day and not run out. 
                    {"  "}{FLEX_SWIPE} is a small, but powerful tool that helps you maximize your tuition!
                </p>
                <GoToLink href="sobie/meal" className="text-[#e81727]">Take Me to FlexSwipe</GoToLink>
            </ObieText>
            <hr className="w-[80%] mx-auto"/>
            <ObieText title={MARK_MY_CALENDAR} image={MARK_MY_CALENDAR_IMAGE} flipped>
                <p className="border-l-4 border-[#FFC72C] pl-2 mb-2">
                    {MARK_MY_CALENDAR} is a tool designed to take your google calendar to the max.
                    With this tool, you will be able to easily enter your course syllabi, and
                    {"  "}{MARK_MY_CALENDAR} will add all of the information to your google calendar!  This includes
                    breaks, class times, office hours, tutoring, and assignments!
                </p>
                <GoToLink href="sobie/mark-my-calendar" className="text-[#FFC72C]">Take Me to Mark My Calendar</GoToLink>
            </ObieText>
            <Title>About This Project</Title>
            <ObieText title="Meet the creator" image={ME_IMAGE}>
                <p className="border-l-4 border-[#e81727] pl-2 mb-2">
                    Hello!  My name is Autumn Rockwell, and I am the creator of this project!  I am a graduating in '27, and I am 
                    majoring in math and computer science.  Making {SOBIE} has been a very fun project as I love seeing others
                    benefit from tools that I create!  This project started out with me creating {OBIE_EATS}, and I decided
                    to expand from there.  Some fun facts about me: I am from Ohio, I love the TV show Bluey, and I love music!
                    I would love to meet some new faces!  Please feel free to follow/message me on social media :)
                </p>
                <GoToLink href="/" className="text-[#e81727]">See my socials!</GoToLink>
            </ObieText>
            <hr className="w-[80%] mx-auto"/>
            <ObieText title="How To Contribute" image={NOTE_BOOK_IMAGE} flipped>
                <p className="border-l-4 border-[#FFC72C] pl-2 mb-2">
                    This project is free and will always be free.  In addition, this project will be maintained throughout my 4 years here
                    at Oberlin, and I hope to keep it maintained well beyond my time here.  Therefore, it is not just my project!  It
                    is a project of all Obies.  If you would like to contribute to the {SOBIE} project, feel free to reach out!
                    Whether you would like to help with the programming, or if you would like to suggest
                    other tools to the {SOBIE} project, you can email me at arockwel@oberlin.edu (or click the link at the bottom of this section).
                    I can't wait to hear from you!
                </p>
                <GoToLink href="mailto:arockwel@oberlin.edu" className="text-[#FFC72C]">Send Me An Email</GoToLink>
            </ObieText>
        </div>
    </>);
}