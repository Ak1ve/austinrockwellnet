from __future__ import annotations

from typing import Generic, TypeVar, Any
from flask import Flask, jsonify, request
import dataclasses
import datetime
import io
import re
import PyPDF2 as Pdf
import asyncio
from . import request_wrapper as req
# import requests_async as req
from pydantic import BaseModel, TypeAdapter
from .service import Service, route
import json

T = TypeVar("T")




class Food(BaseModel):
    # for stevie
    name: str
    date: str
    stationName: str


@dataclasses.dataclass()
class Station:
    name: str
    menu: str

    @classmethod
    def from_text(cls, text: str) -> list[Station]:
        try:
            foods = TypeAdapter(list[Food]).validate_json(text)
            d = {}
            for food in foods:
                name = food.stationName
                y = d.get(name, "")
                d[name] = y + food.name + ", "
            return [cls(name, food) for name, food in d.items()]
        except Exception as e:
            print(e)
            return [cls("Stations Currently Unavailable", "Currently Unavailable")]


@dataclasses.dataclass()
class DiningHalls:
    clarity: str = ""
    lord_saunders: str = ""
    heritage: str = ""

    @classmethod
    def from_menus(cls, clarity: Menu[Day], heritage: Menu[Day], lord_saunders: Menu[Day]) -> Menu[Day[DiningHalls]]:
        menu: Menu[Day[DiningHalls]] = Menu({
            day: Day(lunch=DiningHalls(), dinner=DiningHalls()) for day in clarity.days
        })
        for day, m in clarity.days.items():
            menu.days[day].lunch.clarity = m.lunch
            menu.days[day].dinner.clarity = m.dinner

        for day, m in heritage.days.items():
            menu.days[day].lunch.heritage = m.lunch
            menu.days[day].dinner.heritage = m.dinner

        for day, m in lord_saunders.days.items():
            menu.days[day].lunch.lord_saunders = m.lunch
            menu.days[day].dinner.lord_saunders = m.dinner
        return menu

    def to_json(self) -> dict:
        return {
            "clarity": self.clarity,
            "lord_saunders": self.lord_saunders,
            "heritage": self.heritage
        }


@dataclasses.dataclass()
class Response:
    for_week: int
    menu: Menu[Day[DiningHalls]]
    stevie: Menu[list[Station]]

    def to_json(self) -> dict:
        return {
            "for_week": self.for_week,
            "menu": self.menu.to_json(),
            "stevie": self.stevie.to_json()
        }


@dataclasses.dataclass()
class Day(Generic[T]):
    lunch: T = ""
    dinner: T = ""
    breakfast: T = None

    def to_json(self):
        def to(obj):
            # last event is list[Station]
            return obj if isinstance(obj, str) else None if obj is None\
                else {s.name: s.menu for s in obj} if isinstance(obj, list) else obj.to_json()
        lunch = to(self.lunch)
        breakfast = to(self.breakfast)
        dinner = to(self.dinner)
        resp = {
            "lunch": lunch,
            "dinner": dinner
        }
        if breakfast is not None:
            resp["breakfast"] = breakfast

        return resp


@dataclasses.dataclass()
class Menu(Generic[T]):
    days: dict[str, T] = dataclasses.field(default_factory=lambda: {
        "monday": Day(),
        "tuesday": Day(),
        "wednesday": Day(),
        "thursday": Day(),
        "friday": Day(),
        "saturday": Day(),
        "sunday": Day()
    })

    def to_json(self) -> dict:
        return {k: v.to_json() for k, v in self.days.items()}

    @classmethod
    def from_pages(cls, name: str, pages: list[str], day_regex, form_regex) -> Menu[Day]:
        self = cls()
        try:
            current_day = "monday"
            for x in pages:
                if day_regex.match(x):
                    current_day = x.lower()
                    continue
                mode = "lunch" if "dinner" not in name.lower() else "dinner"
                for entry in [y.strip() for y in form_regex.split(x) if y is not None]:
                    if (mode_entry := entry.lower()) in ["lunch", "dinner"]:
                        mode = mode_entry
                        continue
                    self.days[current_day].__dict__[mode] += entry + " "
            for day, obj in self.days.items():
                obj.lunch = re.sub(r"[ ]{2,}", " ", obj.lunch).strip()
                obj.dinner = re.sub(r"[ ]{2,}", " ", obj.dinner).strip()
            return self
        except Exception as e:
            print(e)
            for d in self.days:
                self.days[d] = "unavailable"
            return self
            

class ObieEatsService(Service):
    _ISO_WEEK = {
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 7,
    }
    _REPLACEMENTS = {
        "\n": " ",
        "*Gluten sensitive options available upon request": "",
        "Vegetarian/Vegan": "",
        "Vegan": "",
        "Entrée": ""
    }
    _days_regex = re.compile("(monday)|(tuesday)|(wednesday)|(thursday)|(friday)|(saturday)|(sunday)", flags=re.IGNORECASE)
    _form_regex = re.compile("(dinner)|(lunch)", flags=re.IGNORECASE)
    _stevie_root_link = "https://dish.avifoodsystems.com/api/menu-items?date={}&locationId=111&mealId={}"
    _clarity_root_link = "https://www.aviserves.com/Oberlin/menus/wk{0}/clarity_menu_wk{0}.pdf"
    _lord_saunders_root_link = "https://www.aviserves.com/Oberlin/menus/wk{0}/lord-saunders_menu_wk{0}.pdf"
    _heritage_root_link = "https://www.aviserves.com/Oberlin/menus/wk{0}/Heritage_menu_wk{0}.pdf"

    async def get_stevie(self, day: str) -> Day[Station]:
        reqs = [req.get(self._stevie_root_link.format(day, day_num), verify=False) for day_num in ("182", "183", "184")]
        breakfast, lunch, dinner = [Station.from_text(x.text) for x in await asyncio.gather(*reqs)]
        return Day(breakfast=breakfast, lunch=lunch, dinner=dinner)

    def get_week(self) -> dict[str, str]:
        now = datetime.datetime.now()
        day = now.isoweekday()
        return {
            k: (now + datetime.timedelta(days=-(day - v))).strftime("%m/%d/%Y") for k, v in self._ISO_WEEK.items()
        }
    
    async def dish(self, location_name: str) -> Menu[Day[str]]:
        """
        https://dish.avifoodsystems.com/api/menu-items/week?date=2/5/2024&locationId=107&mealId=174

        location_name: clarity|lord|heritage
        meal_id: lunch|dinner
        date: 2/5/2024

        location    loc id      lunch id        dinner id
        clarity     107         174             175
        lord        184         XXX             470
        heritage    185         479             480
        
        """
        table = {
            "clarity": {
                "location": 107,
                "lunch": 174,
                "dinner": 175
            },
            "lord": {
                "location": 184,
                "lunch": None,
                "dinner": 470
            },
            "heritage": {
                "location": 185,
                "lunch": 479,
                "dinner": 480
            }
        }
        base = "https://dish.avifoodsystems.com/api/menu-items/week?date={}&locationId={}&mealId={}"
        week = self.get_week()
        first = week["monday"]
        # m/d/Y
        times = {k: f"{v.split('/')[-1]}-{v.split('/')[0]}-{v.split('/')[1]}T00:00:00" for k, v in week.items()}
        lunches = []
        dining_hall = table[location_name]
        if location_name != "lord":
            lunches = json.loads((await req.get(base.format(first, dining_hall["location"], dining_hall["lunch"]), verify=False)).text)
        dinners = json.loads((await req.get(base.format(first, dining_hall["location"], dining_hall["dinner"]), verify=False)).text)
        return Menu({
            k: Day(lunch=", ".join(x["name"] for x in lunches if x["date"] == v),
                   dinner=", ".join(x["name"] for x in dinners if x["date"] == v)) for k, v in times.items()
        })
        ...

    async def get_stevie_week(self) -> Menu[Day[Station]]:
        week = self.get_week()
        reqs = [self.get_stevie(date) for date in week.values()]
        return Menu({
            day: menu for day, menu in zip(week.keys(), await asyncio.gather(*reqs))
        })

    def clean_menu_text(self, text: str):
        txt = text
        for key, value in self._REPLACEMENTS.items():
            txt = txt.replace(key, value)
        return txt

    async def get_menu(self, link: str, name: str = "") -> Menu[Day[str]]:
        try:
            return await self.dish(name)
        except Exception as e1:
                try:
                    reader = Pdf.PdfReader(io.BytesIO((await req.get(link, verify=False)).content))
                    text = "\n".join(reader.pages[x].extract_text() for x in range(len(reader.pages)))
                    page = self.clean_menu_text(text)
                    pages = [x for x in self._days_regex.split(page) if x is not None]
                    return Menu.from_pages(
                        name=pages[0],
                        pages=pages[1:],
                        day_regex=self._days_regex,
                        form_regex=self._form_regex
                    )
                except Exception as e2:
                    return Menu()

    async def get_dining_halls(self) -> Menu[Day[DiningHalls]]:
        w = datetime.datetime.now().isocalendar()[1]
        dining_halls = [self.get_menu(self._clarity_root_link.format(w), "clarity"),
                        self.get_menu(self._heritage_root_link.format(w), "heritage"),
                        self.get_menu(self._lord_saunders_root_link.format(w),  "lord")]
        clarity, heritage, lord_saunders = await asyncio.gather(*dining_halls)  # NOQA
        return DiningHalls.from_menus(clarity=clarity, heritage=heritage, lord_saunders=lord_saunders)

    async def get_response(self) -> Response:
        now = datetime.datetime.now()
        dining_halls, stevie = await asyncio.gather(self.get_dining_halls(), self.get_stevie_week())
        return Response(
            for_week=now.isocalendar()[1],
            menu=dining_halls,
            stevie=stevie
        )


    @route("/api/menus", cache_for=120)
    async def fetch(self) -> Response:
        with self.app.app_context():
            return jsonify((await self.get_response()).to_json())
