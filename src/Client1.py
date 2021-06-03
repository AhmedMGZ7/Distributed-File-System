import zmq
from zmq.sugar import socket
context = zmq.Context()
current_client = 1
clients_ips = ["tcp://127.0.0.1:8002", "tcp://127.0.0.1:8003"]


socket = context.socket(zmq.REP)
socket.bind(clients_ips[current_client])
while True:
    msg = socket.recv()
    print("From Client :", msg)
    smsg = input('enter your message : ')
    socket.send_string(smsg)
    print("")
