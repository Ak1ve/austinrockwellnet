from flask import Response, jsonify
from pydantic import BaseModel
from .service import Service, route
from pathlib import Path

DB_PATH = (Path(__file__) / ".." / "database.json").resolve()

class Break(BaseModel):
    breakName: str
    startDate: str
    endDate: str


class CurrentCalendar(BaseModel):
    currentTerm: str  # 202402 for example
    semesterStart: str
    semesterEnd: str
    readingPeriodStart: str
    readingPeriodEnd: str
    breaks: list[Break]
    finals: dict[str, str]


class Database(BaseModel):
    notifications: dict[str, str]
    adminHash: str
    currentCalendar: CurrentCalendar

    @classmethod
    def load(cls):
        return Database.parse_file(DB_PATH)

    def save(self) -> None:
        with DB_PATH.open("w") as f:
            f.write(self.json())


class DatabaseService(Service):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db = Database.load()

    @route("/api/db")
    async def fetch(self) -> Response:
        with self.app.app_context():
            return jsonify(self.db.json())

    @route("/api/db/calendar")
    async def fetch_calendar(self) -> Response:
        with self.app.app_context():
            return jsonify(self.db.currentCalendar.dict())


