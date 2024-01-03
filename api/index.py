from __future__ import annotations
from service import Service
from flask import Flask, jsonify, request
import sys
from obie_eats import ObieEatsService
from connect_oberlin import ConnectOberlinService
from db import DatabaseService
from notifications import NotificationService
app = Flask(__name__)

print(sys.version_info)


class Client:
    def __init__(self):
        self.services: list = []

    def load_route(self, s: Service, name: str):
        fetch = getattr(s, name)
        async def f():
            if fetch.__service_json_body__:
                return await fetch(request.get_json(force=True))
            return await fetch()
        f.__name__ = fetch.__service_route__.replace("/", "_") + "__".join(fetch.__service_methods__)
        app.add_url_rule(fetch.__service_route__, view_func=f, methods=fetch.__service_methods__)

    def load_service(self, s: type[Service]):
        service = s(app, self)
        for name in s.routes():
            self.load_route(service, name)
        self.services.append(service)
    
    def get_service(self, service: type[Service]) -> Service:
        for x in self.services:
            if x.__class__ == service:
                return x


client = Client()
client.load_service(ObieEatsService)
client.load_service(ConnectOberlinService)
client.load_service(DatabaseService)
client.load_service(NotificationService)

# if __name__ == "__main__":
#     app.run()