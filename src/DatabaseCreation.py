import pymongo
import json
import pandas as pd

def importData(csv_path):
    data = pd.read_csv(csv_path)
    print("dataRead")
    payload = json.loads(data.to_json(orient='records'))
    print(payload[0])
    return payload
def database ():
    try:
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        dblist = myclient.list_database_names()
        if "mydatabase" in dblist:
            print("The database exists.")
        else:
            mydb = myclient["mydatabase"]
            print("The database created.")
            data = importData("../database/googleplaystore.csv")
            mycol = mydb["apps"]
            #mycol.delete_many()
            mycol.insert_many(data)
    except: 
        print("Can't connect to database")

database()