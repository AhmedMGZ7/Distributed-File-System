import zmq
from zmq.sugar import socket
context = zmq.Context()

socket = context.socket(zmq.REP)
socket.bind("tcp://127.0.0.1:8001")

while True:
    msg = socket.recv()
    print("From Client :", msg)
    smsg = input('enter your message : ')
    socket.send_string(smsg)
    print("")
