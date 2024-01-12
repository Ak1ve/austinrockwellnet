from .service import Service, route
from flask import jsonify, Response
import requests_async as req
from .db_service import DatabaseService
from bs4 import BeautifulSoup


class BannerService(Service):
    __meeting__ = "https://banner.cc.oberlin.edu/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes?term={}&courseReferenceNumber={}"
    __details__ = "https://banner.cc.oberlin.edu/StudentRegistrationSsb/ssb/searchResults/getClassDetails?term={}&courseReferenceNumber={}&first=first"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.db: DatabaseService = self.get_service(DatabaseService)
    
    @route("/api/banner/meeting/<int:crn>")
    async def fetch_meeting(self, crn: int) -> Response:
        with self.app.app_context():
            return jsonify((await req.get(self.__meeting__.format(self.db.db.currentCalendar.currentTerm, crn), verify=False)).json())
    
    async def details(self, crn: int) -> dict:
        x = await req.post(self.__details__.format(self.db.db.currentCalendar.currentTerm, crn), verify=False)
        soup = BeautifulSoup(x.text, features="html.parser")
        return {
            k: soup.find(id=k).text for k in [
                "sectionNumber", "courseNumber", "courseTitle", "subject"
            ]
        }

    @route("/api/banner/details/<int:crn>")
    async def fetch_details(self, crn: int) -> Response:
        with self.app.app_context():
            return jsonify(await self.details(crn))