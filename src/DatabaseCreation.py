import pymongo
import json
import pandas as pd
import math

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
            mydb = myclient["mydatabase"]
            mycol = mydb["apps"]
            return mycol
        else:
            mydb = myclient["mydatabase"]
            print("The database created.")
            data = importData("../database/googleplaystore.csv")
            mycol = mydb["apps"]
            #mycol.delete_many()
            mycol.insert_many(data)
            return mycol
    except: 
        print("Can't connect to database")

mycol = database()
BigTable = mycol.find().sort("Category")
Categories = mycol.distinct("Category")
NoOfCategories = len(Categories)
Tablets = [[],[],[],[]]
NoOfCategoriesPerTablet = math.floor(NoOfCategories/4)
NoInCurrentTablet = 0
TabletNo = 0
for i in range(NoOfCategories):
    if NoInCurrentTablet == 8 and TabletNo < 3:
        NoInCurrentTablet = 0
        TabletNo += 1
    myquery = {"Category":Categories[i]}
    category = list(mycol.find(myquery))
    Tablets[TabletNo].append(category)
    NoInCurrentTablet += 1