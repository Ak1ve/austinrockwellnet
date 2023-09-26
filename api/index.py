from flask import Flask, jsonify
app = Flask(__name__)
import dataclasses
import datetime
import io
import pprint
import re
import PyPDF2 as Pdf
import requests
from pydantic import BaseModel, TypeAdapter



_days = re.compile("(monday)|(tuesday)|(wednesday)|(thursday)|(friday)|(saturday)|(sunday)", flags=re.IGNORECASE)
_form = re.compile("(dinner)|(lunch)", flags=re.IGNORECASE)



class Food(BaseModel):
    # for stevie
    name: str
    date: str
    stationName: str


def get_stations(txt: str):
    # for stevie
    foods = TypeAdapter(list[Food]).validate_json(txt)
    d = {}
    for food in foods:
        name = food.stationName
        y = d.get(name, "")
        d[name] = y + food.name + ", "
    return d


def get_day(day: str):
    # for stevie
    root_link = "https://dish.avifoodsystems.com/api/menu-items?date={}&locationId=111&mealId={}"
    # "breakfast": {station: food}, "lunch", "dinner"
    breakfast = get_stations(requests.get(root_link.format(day, "182"), verify=False).text)
    lunch = get_stations(requests.get(root_link.format(day, "183"), verify=False).text)
    dinner = get_stations(requests.get(root_link.format(day, "184"), verify=False).text)

    return {
        "breakfast": breakfast,
        "lunch": lunch,
        "dinner": dinner
    }


def get_week():
    # for stevie
    now = datetime.datetime.now()
    day = now.isoweekday()  # monday == 1
    # MONDAY == 1
    days = {
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6,
        "sunday": 7,
    }
    return {
        k: (now + datetime.timedelta(days=-(day - v))).strftime("%m/%d/%Y") for k, v in days.items()
    }


def get_week_menu():
    # for stevie
    dates = get_week()
    return {
        day: get_day(date) for day, date in dates.items()
    }



@dataclasses.dataclass
class Day:
    lunch: str = ""
    dinner: str = ""

    def to_json(self):
        return {
            "lunch": self.lunch,
            "dinner": self.dinner
        }


@dataclasses.dataclass
class Menu:
    name: str
    days: dict[str, Day] = dataclasses.field(default_factory=lambda: {
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


def get_menu(link) -> Menu:
    thing = io.BytesIO(requests.get(link).content)
    reader = Pdf.PdfReader(thing)
    text = "\n".join(reader.pages[x].extract_text() for x in range(len(reader.pages)))
    page = text.replace("  ", " ").replace("\n", " ").replace("*Gluten sensitive options available upon request", "")\
        .replace("Vegetarian/Vegan", "").replace("Vegan", "").replace("Entrée", "")
    pages = [x for x in _days.split(page) if x is not None]
    menu = Menu(pages[0])
    current_day = "monday"
    for x in pages[1:]:
        if _days.match(x):
            current_day = x.lower()
            continue
        mode = "lunch" if "dinner" not in menu.name.lower() else "dinner"
        for entry in [y.strip() for y in _form.split(x) if y is not None]:
            if entry.lower() == "lunch":
                mode = "lunch"
                continue
            if entry.lower() == "dinner":
                mode = "dinner"
                continue
            if mode == "lunch":
                menu.days[current_day].lunch += entry + " "
            elif mode == "dinner":
                menu.days[current_day].dinner += entry + " "
    for day, obj in menu.days.items():
        obj.lunch = re.sub(r"[ ]{2,}", " ", obj.lunch).strip()
        obj.dinner = re.sub(r"[ ]{2,}", " ", obj.dinner).strip()
    return menu


LAST_UPDATED = datetime.datetime.now() - datetime.timedelta(days=500)
RESPONSE: dict = None


def menus(w: int) -> dict[str, dict]:
    clarity = get_menu(f"https://www.aviserves.com/Oberlin/menus/wk{w}/clarity_menu_wk{w}.pdf").to_json()
    lord_saunders = get_menu(f"https://www.aviserves.com/Oberlin/menus/wk{w}/lord-saunders_menu_wk{w}.pdf").to_json()
    heritage = get_menu(f"https://www.aviserves.com/Oberlin/menus/wk{w}/Heritage_menu_wk{w}.pdf").to_json()
    
    return {
        day: {
            "lunch": {
                "clarity": clarity[day.lower()]["lunch"],
                "lord_saunders": lord_saunders[day.lower()]["lunch"],
                "heritage": heritage[day.lower()]["lunch"]
            },
            "dinner": {
                "clarity": clarity[day.lower()]["dinner"],
                "lord_saunders": lord_saunders[day.lower()]["dinner"],
                "heritage": heritage[day.lower()]["dinner"]
            }
        } for day in ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }


def fetch_menus() -> dict:
    global RESPONSE
    global LAST_UPDATED
    now = datetime.datetime.now()
    hours_since = (now - LAST_UPDATED).seconds / 60 / 60
    # refreshes every day just in case
    if hours_since <= 12 and RESPONSE is not None:
        print("CACHE HIT")
        return RESPONSE
    
    LAST_UPDATED = now
    m = menus(now.isocalendar()[1])
    RESPONSE = {
        "for_week": now.isocalendar()[1],
        "menu": m,
        "stevie": get_week_menu()
    }
    return RESPONSE


@app.route("/api/menus")
def hello_world():
    return jsonify(fetch_menus())