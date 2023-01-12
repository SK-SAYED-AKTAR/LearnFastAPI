import pymongo
#Creating a pymongo client
client = pymongo.MongoClient('localhost', 27017)

class MyDB_Handler:
    def __init__(self):
        self.db = client['FastAPI_MESSENGER']

    def create_collection(self, collection):
        obj = self.db[collection]
        return obj