from flask import Flask, jsonify
app = Flask(__name__)
import dataclasses
import datetime
import io
import pprint
import re
import PyPDF2 as Pdf
import requests

path = r"C:\Users\legos\Desktop\clarity_menu_wk38.pdf"


_days = re.compile("(monday)|(tuesday)|(wednesday)|(thursday)|(friday)|(saturday)|(sunday)", flags=re.IGNORECASE)
_form = re.compile("(dinner)|(lunch)", flags=re.IGNORECASE)


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
        } for day in ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    }


def fetch_menus() -> dict:
    global RESPONSE
    global LAST_UPDATED
    now = datetime.datetime.now()
    days_since = (now - LAST_UPDATED).days
    # refreshes every day just in case
    if days_since <= 1 and RESPONSE is not None:
        print("CACHE HIT")
        return RESPONSE
    
    LAST_UPDATED = now
    m = menus(now.isocalendar()[1])
    RESPONSE = {
        "for_week": now.isocalendar()[1],
        "menu": m,
    }
    return RESPONSE


@app.route("/api/menus")
def hello_world():
    return jsonify(fetch_menus())