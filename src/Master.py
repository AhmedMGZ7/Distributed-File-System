import zmq
from zmq.sugar import socket
from zmq.sugar.constants import NOBLOCK
from .DatabaseCreation import Tablets, dic_category_in_tablet
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:8001")

arr_ip_tablet = [

]
# 0
# 1
# 2
# 3
while True:
    msg = socket.recv(flags=zmq.NOBLOCK)
    try:
        # check for a message, this will not block
        message = socket.recv(flags=zmq.NOBLOCK)
        if msg == "alive-client":
            # meta data is sent to the client
            socket.send_json(arr_ip_tablet)
            socket.send_json(dic_category_in_tablet)
        elif msg == "alive-server":
            ip = socket.recv()
            arr_ip_tablet.append({
                'ip': ip,
                'tablets': {
                    len(arr_ip_tablet),
                    len(arr_ip_tablet)+1
                }
            })
            # send the 2 tablets
            socket.send_json(Tablets[len(arr_ip_tablet)-1])
            socket.send_json(Tablets[len(arr_ip_tablet)])
            # send to that ip

    except zmq.Again as e:
        print("No message received yet")

    print("From Client :", msg)
    smsg = input('enter your message : ')
    socket.send_string(smsg)
    print("")
