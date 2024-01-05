from flask import Response, jsonify
from pydantic import BaseModel
from .service import Service, route
from pathlib import Path

DB_PATH = (Path(__file__) / ".." / "database.json").resolve()

class Database(BaseModel):
    notifications: dict[str, str]
    adminHash: str
    currentTerm: str

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



