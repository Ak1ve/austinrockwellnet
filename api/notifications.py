from flask import Flask, jsonify, Response
from service import Service, route
from db import DatabaseService
import hashlib


class NotificationService(Service):
    """
    Example response:
    {
        "raw_password": "password",
        "route": "/sobie/menu",
        "value": "body here!"
    }
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db: DatabaseService = self.get_service(DatabaseService)

    @route("/api/notifications")
    async def fetch(self) -> Response:
        with self.app.app_context():
            return jsonify(self.db.db.notifications)

    @route("/api/notifications", json_body=True)
    async def set(self, body: dict) -> bool:
        """
        Returns true if successful
        :param raw_password:
        :param route:
        :param value:
        :return:
        """
        raw_password = body["raw_password"]
        route = body["route"]
        value = body["value"]
        if hashlib.sha256(raw_password.encode()).hexdigest() == self.db.db.adminHash:
            self.db.db.notifications[route] = value
            return "True"
        return "False"