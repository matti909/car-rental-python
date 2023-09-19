from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config

DB_URL = config("DB_URL", cast=str)
DB_NAME = config("DB_NAME", cast=str)
DB_COLE = config("COLLECTION_NAME", cast=str)


class MongoDB:
    def __init__(self, db_url, db_name, collection_name):
        self.client = AsyncIOMotorClient(db_url)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    async def close_connection(self):
        self.client.close()


mongodb = MongoDB(DB_URL, DB_NAME, DB_COLE)
