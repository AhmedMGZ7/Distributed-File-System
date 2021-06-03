import zmq
from zmq.sugar import socket
from zmq.sugar.constants import NOBLOCK, NULL

localhost = "tcp://127.0.0.1" 
ServerMasterPort = 8001  # Server - Master (req-rep) used to notify the master of queries
MasterServerPort = 8002  # Master - server  (req-rep) used to make Polling


context = zmq.Context()
# to make polling
socketM_S = context.socket(zmq.REP)
socketM_S.bind(f"{localhost}:{MasterServerPort}")

# to used to notify the master of queries
socketS_M = context.socket(zmq.REQ)
socketS_M.connect(f"{localhost}:{ServerMasterPort}")
lol = True

# Initialization 
# Initialize the tablet data
#================================================
while True:
    lol = input('enter your message : ')
    if lol == '1':
        socketS_M.send_string("update",flags=NOBLOCK)
    else:
        socketS_M.send_string("struc",flags=NOBLOCK)
    try:
        msg = socketM_S.recv(flags=NOBLOCK)
        if msg is not None:
            msg = msg.decode('utf-8')
            socketM_S.send_string("!* gg ez wp jng diff *!")
            #print("From Client :", msg)
    except zmq.Again as e:
        print()
