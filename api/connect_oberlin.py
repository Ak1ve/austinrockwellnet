from .service import Service, route
from flask import jsonify
import PyPDF2 as Pdf
import requests_async as req


class ConnectOberlinService(Service):
    @route("/api/presence")
    async def fetch(self):
        with self.app.app_context():
            return jsonify((await req.get("https://api.presence.io/oberlin/v1/events", verify=False)).json())