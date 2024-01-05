import functools
from flask import Flask
from abc import abstractmethod, ABC
from typing import Callable, TypeVar
import datetime

T = TypeVar("T")



def route(s: str, json_body: bool = False, methods: list[str] = None,
          cache_for: int = None) -> Callable[[T], T]:
    """
    s: the route name
    json_body: convert body to json. automatically makes methods be [POST]
    cache_for: in minutes
    """
    def inner(func: T):
        func.__service_route__ = s
        func.__service_json_body__ = json_body
        func.__service_methods__ = methods if methods is not None else ["GET"] if not json_body else ["POST"]
        
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            if cache_for is None:
                return await func(*args, **kwargs)
            time_since = abs((datetime.datetime.now() - wrapper.__time__).seconds) / 60
            # refresh cache
            if wrapper.__cache__ is None or time_since >= cache_for:
                wrapper.__cache__ = await func(*args, **kwargs)
                wrapper.__time__ = datetime.datetime.now()
            else:
                ... 
            return wrapper.__cache__
        wrapper.__cache__ = None
        wrapper.__time__ = datetime.datetime.now()
        return wrapper
    return inner

class Service(ABC):
    """
    A Service is anything that is linked to the /api/
    """
    
    @classmethod
    def routes(cls) -> list[str]:
        return [k for k, v in cls.__dict__.items() if hasattr(v, "__service_route__")]

    def __init__(self, app: Flask, client):
        self.app = app
        self._client = client
    
    def get_service(self, name):
        return self._client.get_service(name)



