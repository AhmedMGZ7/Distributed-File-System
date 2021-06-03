import zmq
from zmq.sugar import socket
context = zmq.Context()
current_tablet = 1
tablet_ips = ["tcp://127.0.0.1:8004", "tcp://127.0.0.1:8005"]
socket = context.socket(zmq.REP)
socket.bind(tablet_ips[current_tablet])

while True:
    msg = socket.recv()

    print("From Client :", msg)
    smsg = input('enter your message : ')
    socket.send_string(smsg)
    print("")
