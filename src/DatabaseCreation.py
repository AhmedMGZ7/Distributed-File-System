import pymongo
import json
import pandas as pd
import math

localhost = "tcp://127.0.0.1" 
ServerMasterPort = 8001  # Server - Master (req-rep) used to notify the master of queries
MasterServerPort = 8002  # Master - server  (req-rep) used to make Polling
    # "tcp://127.0.0.1:8003",  # tablet server 2
    # "tcp://127.0.0.1:8004",  # client server 1
    # "tcp://127.0.0.1:8004",  # client server 2

# read csv from excel and save it in array of json


def importData(csv_path):
    data = pd.read_csv(csv_path)
    print("dataRead")
    payload = json.loads(data.to_json(orient='records'))
    print(payload[0])
    return payload
# Create Database and collection
# if database exits then no need to create it


def database():
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
            # mycol.delete_many()
            mycol.insert_many(data)
            return mycol
    except:
        print("Can't connect to database")


mycol = database()
# Sort Table by Category to use it to divide it into tablets
BigTable = mycol.find().sort("Category")
# Get Number of Categories in table
Categories = mycol.distinct("Category")
no_of_categories = len(Categories)
# Create tablets
# map categories to tablets
# map tablets to machines
Tablets = [[], [], [], []]
no_of_categories_Per_Tablet = math.floor(no_of_categories/4)
no_in_currentTablet = 0
tablet_no = 0
tablet_per_machine = 2
Machine = 2
dic_tablet_in_machine = {}
dic_category_in_tablet = {}
for i in range(no_of_categories):
    if no_in_currentTablet == no_of_categories_Per_Tablet and tablet_no < 3:
        dic_tablet_in_machine[tablet_no] = Machine
        no_in_currentTablet = 0
        tablet_no += 1
        if tablet_no == tablet_per_machine:
            Machine += 1
    myquery = {"Category": Categories[i]}
    category = list(mycol.find(myquery))
    Tablets[tablet_no].append(category)
    dic_category_in_tablet[Categories[i]] = tablet_no
    no_in_currentTablet += 1
dic_tablet_in_machine[tablet_no] = Machine

# print(dic_tablet_in_machine)
# print(dic_category_in_tablet)
# print()
