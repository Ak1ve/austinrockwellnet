import httpx


async def get(*args, **kwargs):
    verify = True
    if "verify" in kwargs:
        del kwargs["verify"]
    async with httpx.AsyncClient(verify=verify) as client:
        return await client.get(*args, **kwargs)