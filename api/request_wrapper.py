import httpx


async def get(*args, **kwargs):
    async with httpx.AsyncClient() as client:
        return client.get(*args, **kwargs)