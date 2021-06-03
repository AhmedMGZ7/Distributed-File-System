import zmq
from zmq.sugar import socket
from zmq.sugar.constants import NOBLOCK
import time
from DatabaseCreation import Tablets, dic_category_in_tablet, ServerMasterPort,MasterServerPort, localhost
import threading

context = zmq.Context()
# to make polling
socketM_S = context.socket(zmq.REQ)
socketM_S.connect(f"{localhost}:{MasterServerPort}")

# to used to notify the master of queries
socketS_M = context.socket(zmq.REP)
socketS_M.bind(f"{localhost}:{ServerMasterPort}")

# arr_ip_tablet = [

# ]
# 0
# 1
# 2
# 3

# ================================ Initialization =======================================
# if msg == "alive-client":
#             # meta data is sent to the client
#             socket.send_json(arr_ip_tablet)
#             socket.send_json(dic_category_in_tablet)
#         elif msg == "alive-server":
#             ip = socket.recv()
#             arr_ip_tablet.append({
#                 'ip': ip,
#                 'tablets': {
#                     len(arr_ip_tablet),
#                     len(arr_ip_tablet)+1
#                 }
#             })
#             # send the 2 tablets
#             socket.send_json(Tablets[len(arr_ip_tablet)-1])
#             socket.send_json(Tablets[len(arr_ip_tablet)])
# =========================================================================================
# rows_limit = 50
# def Load_balancing(rows_number):
#     if(rows_number > rows_limit):
#         # load balancing
#     # meta data update
#     arr_ip_tablet.append({
#         'ip': ip,
#         'tablets': {
#             len(arr_ip_tablet),
#             len(arr_ip_tablet)+1
#         }
def Polling():
    socketM_S.send_string("Ezayak bs2al fek msh zayak!")
    print("he replied ",socketM_S.recv().decode('utf-8'))

    
Start_interval = time.time()
while True:
    try:
        
        msg = socketS_M.recv(flags=NOBLOCK)
        # Data update  (set or delete cell)
        # todo: update main db
        if   msg.decode('utf-8') == "update":
            # Table change
            print("Data update has occurred")
            # operation = socketS_M.recv("")
            socketS_M.send_string("done update")
            pass
        
        # Structure update (add row or delete row)
        # todo: check for balancing & and balance if needed
        elif msg.decode('utf-8') == "struc":
            print("Structure update has occurred")
            socketS_M.send_string("done structure")
            pass
        else:
            socketS_M.send_string("lol")
        # todo: check for active tablet servers every interval (Polling)
        # for server in arr_ip_tablet:
        #     ip = server['ip']

        if time.time() - Start_interval > 20:
            Polling()
            Start_interval = time.time()

    except zmq.Again as e:
        print("2")
        #time.sleep(1)
        #print("No message received yet")

    