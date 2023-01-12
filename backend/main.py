from fastapi import FastAPI, Form, UploadFile, File, Depends, WebSocket, WebSocketDisconnect
from typing import List
from fastapi.responses import FileResponse
import os
from dbconn import MyDB_Handler
from fastapi.middleware.cors import CORSMiddleware
from bson import json_util
import json
import uuid


# ALL ABOUT TOKEN AUTHENTICATION
import datetime
import jwt
from TokenAuthentication.jwt_auth.verify_token import verify_token
# TOKEN AUTHENTICATION IMPORT STATEMENTS END HERE

# TOKEN AUTHENTICATION CONFIG
KEY = "SAYED"
EXPIRE = datetime.datetime.utcnow() + datetime.timedelta(hours=8)


app = FastAPI()
dbHandler = MyDB_Handler()
MY_COLLECTION = dbHandler.create_collection("MyUsers")
CHAT_COLLECTION = dbHandler.create_collection("ChatDetails")
FR_COLLECTION = dbHandler.create_collection("FriendRequest")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://messenger-lake.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def index():
    return {"msg": "Welcome to the home page...", "status": "OK"}

@app.post("/login")
def login(email=Form(), password=Form()):
    user = MY_COLLECTION.find_one({"email":email, "password":password})
    if user is not None:
        mytoken = jwt.encode({"email": email, "exp": EXPIRE}, KEY)
        return {"token":str(mytoken), "status": "OK"}
    else:
        return {"message":"Unauthenticated User.", "status": "InvalidUser"}

@app.post("/register")
def register(
        photo: UploadFile,
        first_name: str=Form(None), 
        last_name: str=Form(None), 
        email: str=Form(None), 
        password: str=Form(None),
        gender: str=Form(None),
    ):

    is_user_exist = MY_COLLECTION.find_one({"email": email})
    if is_user_exist==None:
        photo_filename = email+photo.filename
        data = {"first_name": first_name, "last_name": last_name, "email": email, "password": password, "gender": gender, "photo": photo_filename, "friend_list":[], "sent_friend_request": [], "got_friend_request": []}
        with open("ProfilePhoto/"+photo_filename, 'wb') as f:
            content = photo.file.read() 
            f.write(content) 
        # Finally add data to your DataBase
        MY_COLLECTION.insert_one(data)
        # Generate the token
        mytoken = jwt.encode({"email": email, "exp": EXPIRE}, KEY)
        return {"msg": "Successfully registered a new user.", "token":str(mytoken), "status": "OK"}
    else:
        return {"msg": "User already exist, with this email.", "status": "UserExist"}

@app.get("/dashboard")
def dashboard(res: str=Depends(verify_token)):
    if res['result'] == True:
        user_data = MY_COLLECTION.find_one({"email":res['data']['email']})
        json_data_with_backslashes = json_util.dumps(user_data)
        json_data = json.loads(json_data_with_backslashes)
        return {"msg": "Welcome to dashboard", "data": json_data, "status": "OK"}
    else:
        return res

@app.get("/my-details")
def my_details(res: str=Depends(verify_token),):
    if res['result'] == True:
        user_data = MY_COLLECTION.find_one({"email": res['data']['email']})
        json_data_with_backslashes = json_util.dumps(user_data)
        json_data = json.loads(json_data_with_backslashes)
        return {"msg": "Success", "data": json_data, "status": "OK"}
    else:
        return {"msg": "msg not good", "status": "ERROR"}

@app.get("/getImg/{img}")
def get_img(img):
    return FileResponse(f"ProfilePhoto/{img}")

@app.post("/update_user")
def update_user(
        photo: UploadFile=File(None),
        res: str=Depends(verify_token),
        first_name: str=Form(None), 
        last_name: str=Form(None), 
        email: str=Form(None), 
        password: str=Form(None),
        gender: str=Form(None),
    ):
    if res['result'] == True:
        if photo == None:
            userEmail = res['data']['email']

            data = {"first_name": first_name, "last_name": last_name, "email": email, "password": password, "gender": gender}
            newvalues = { "$set": data }
            myquery = {"email": userEmail}
            
            # Finally update it to database
            obj = MY_COLLECTION.update_one(myquery, newvalues)
            if obj.acknowledged:
                update_token = jwt.encode({"email": email, "exp": EXPIRE}, KEY)
                return {"msg": "Data updated successfully", "updated_token": str(update_token), "status": "OK"}
            else:
                return {"msg": "Something went wrong, please try again.", "status": "OK"}
        else:
            userEmail = res['data']['email']
            photo_filename = email+photo.filename

            data = {"first_name": first_name, "last_name": last_name, "email": email, "password": password, "gender": gender, "photo": photo_filename}
            newvalues = { "$set": data }
            myquery = {"email": userEmail}

            # Delete the previous image
            allImages = os.listdir("ProfilePhoto/")
            for i in allImages:
                if str(i).__contains__(userEmail):
                    os.remove(f"ProfilePhoto/{i}")
            # Save the new image
            with open("ProfilePhoto/"+photo_filename, 'wb') as f:
                content = photo.file.read() 
                f.write(content)
            # Finally update it to database
            obj = MY_COLLECTION.update_one(myquery, newvalues)
            if obj.acknowledged:
                update_token = jwt.encode({"email": email, "exp": EXPIRE}, KEY)
                return {"msg": "Data updated successfully", "updated_token": str(update_token), "status": "OK"}
            else:
                return {"msg": "Something went wrong, please try again.", "status": "OK"}
    else:
        return {"msg": "Not working", "status": "OK", "result": res}

@app.get("/add-friend-list")
def add_friend_list(res: str=Depends(verify_token),):
    if res['result'] == True:
        user_data = MY_COLLECTION.find({"email":{"$ne": res['data']['email']}})
        json_data_with_backslashes = json_util.dumps(user_data)
        json_data = json.loads(json_data_with_backslashes)
        return {"msg": "Success", "data": json_data, "status": "OK"}
    else:
        return {"msg": "msg not good", "status": "ERROR"}

def handleGotAndSentReqColumn(myemail, friendemail):
    try:
        user_data = MY_COLLECTION.find_one({"email": myemail})
        data = user_data['got_friend_request']
        data.remove(friendemail)
        MY_COLLECTION.update_one({"email": myemail}, {"$set": {"got_friend_request": data}})

        user_data = MY_COLLECTION.find_one({"email": friendemail})
        data = user_data['sent_friend_request']
        data.remove(myemail)
        MY_COLLECTION.update_one({"email": friendemail}, {"$set": {"sent_friend_request": data}})
        return True
    except:
        return False

@app.post("/accept-friend")
def accept_friend(res: str=Depends(verify_token), email: str=Form(None)):
    if res['result'] == True:
        result_handle_rq = handleGotAndSentReqColumn(res['data']['email'], email)
        if result_handle_rq == True:
            user_data = MY_COLLECTION.find_one({"email": res['data']['email']})
            exitingFriendList = user_data['friend_list']
            updateData = exitingFriendList+[email]
            obj = MY_COLLECTION.update_one({"email": res['data']['email']}, {"$set": {"friend_list": updateData}})
            if obj.acknowledged:
                user_data = MY_COLLECTION.find_one({"email": email})
                exitingFriendList = user_data['friend_list']
                updateData = exitingFriendList+[res['data']['email']]
                obj = MY_COLLECTION.update_one({"email": email}, {"$set": {"friend_list": updateData}})
                if obj.acknowledged:
                    return {"msg": "Successfully added a new friend...", "status": "OK"}
                else:
                    return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}
        else:
            return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}
    else:
        return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}


@app.post("/handle-friend-request")
def handleFriendReq(res: str=Depends(verify_token), email: str=Form(None)):
    if res['result'] == True:
        sender_email = res['data']['email']
        to_email = email
        # First create the new table for requests
        data = {"time": datetime.datetime.now(), "sender": sender_email, "to": to_email, "status": "pending"}
        obj = FR_COLLECTION.insert_one(data)
        if obj.acknowledged:
            #Update your sent_friend_request column
            user_data = MY_COLLECTION.find_one({"email": sender_email})
            try:
                exitingReqFriendList = user_data['sent_friend_request']
            except:
                exitingReqFriendList = []
            updateData = exitingReqFriendList+[to_email]
            obj = MY_COLLECTION.update_one({"email": sender_email}, {"$set": {"sent_friend_request": updateData}})
            if obj.acknowledged:
                # Now update the friend's got_friend_request column
                user_data = MY_COLLECTION.find_one({"email": to_email})
                try:
                    exitingGotFriendList = user_data['got_friend_request']
                except:
                    exitingGotFriendList = []
                updateData = exitingGotFriendList+[sender_email]
                obj = MY_COLLECTION.update_one({"email": to_email}, {"$set": {"got_friend_request": updateData}})
                if obj.acknowledged:
                    return {"msg": "Successfully sent the request...", "status": "OK"}
                else:
                    return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}
            else:
                return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}
        else:
            return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}

@app.post("/un-friend")
def un_friend(res: str=Depends(verify_token), email: str=Form(None)):
    if res['result'] == True:
        user_data = MY_COLLECTION.find_one({"email": res['data']['email']})
        exitingFriendList = set(user_data['friend_list'])
        updateData = list(exitingFriendList - {email})
        obj = MY_COLLECTION.update_one({"email": res['data']['email']}, {"$set": {"friend_list": updateData}})
        if obj.acknowledged:
            # Friend er existing friend list
            user_data = MY_COLLECTION.find_one({"email": email})
            exitingFriendList = set(user_data['friend_list'])
            updateData = list(exitingFriendList - {res['data']['email']})
            obj = MY_COLLECTION.update_one({"email": email}, {"$set": {"friend_list": updateData}})
            if obj.acknowledged:
                return {"msg": "Successfully deleted a friend...", "status": "OK"}
            else:
                return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}
        else:
            return {"msg": "Something went wrong, please try again !!!", "status": "ERROR"}

@app.get("/my-friend-list")
def my_friend_list(res: str=Depends(verify_token),):
    if res['result'] == True:
        user_data = MY_COLLECTION.find({"email":{"$ne": res['data']['email']}})
        json_data_with_backslashes = json_util.dumps(user_data)
        json_data = json.loads(json_data_with_backslashes)
        return {"msg": "Success", "data": json_data, "status": "OK"}
    else:
        return {"msg": "error", "status": "ERROR"}

@app.post("/makeChatroomId")
def makeChatroomId(res: str=Depends(verify_token), friend_email: str=Form()):
    if res['result'] == True:
        my_email = res['data']['email']
        chatroomId = my_email+"_|_"+friend_email
        data = {"chatroomid": chatroomId, "chats": []}
        obj = CHAT_COLLECTION.find_one({"$or": [{"chatroomid": my_email+"_|_"+friend_email}, {"chatroomid": friend_email+"_|_"+my_email}]})
        if obj is None:
            insert_obj = CHAT_COLLECTION.insert_one(data)
            if insert_obj.acknowledged:
                return {'msg': "Success", "chatroomid": chatroomId, "status": "OK"}
            else:
                return {'msg': "Something went wrong...", "status": "ERROR"}
        else:
            return {'msg': "Success", "chatroomid": obj['chatroomid'], "status": "OK"}
    else:
        return {'msg': res['msg'], "status": "ERROR"}


# Only For Real Time Chat #
WEBSOCKET_STORE = dict()
####################################

@app.websocket("/saveChat")
async def saveChat(websocket: WebSocket, my_email:str, friend_email: str):
    WEBSOCKET_STORE[my_email+"_|_"+friend_email] = websocket
    
    await websocket.accept()
    while True:
        message = await websocket.receive_text()
        if message != "SAyeD n-o mesSage":
            filter_query = {"$or": [{"chatroomid": my_email+"_|_"+friend_email}, {"chatroomid": friend_email+"_|_"+my_email}]} 
            CHAT_COLLECTION.update_one(filter_query, {'$push': {'chats': {"id": str(uuid.uuid4()), "time": datetime.datetime.now(), "sender": my_email, "to": friend_email, "msg": message}}})
            
            # Now send the updated message
            filter_query = {"$or": [{"chatroomid": my_email+"_|_"+friend_email}, {"chatroomid": friend_email+"_|_"+my_email}]} 
            data = CHAT_COLLECTION.find_one(filter_query)
            json_data_with_backslashes = json_util.dumps(data)
            json_data = json.loads(json_data_with_backslashes)
            # print("The Webstore:", WEBSOCKET_STORE)
            for k, web in WEBSOCKET_STORE.items():
                try:
                    if k == friend_email+"_|_"+my_email or k == my_email+"_|_"+friend_email:
                        await web.send_json({'msg': "Success", "data": json_data['chats'], "status": "OK"})
                    else:
                        print("="*80)
                        print(k, web)
                        print("="*80)
                except:
                    print("EXCEPTION OCCURED")
        else:
            # Only send the updated message
            filter_query = {"$or": [{"chatroomid": my_email+"_|_"+friend_email}, {"chatroomid": friend_email+"_|_"+my_email}]} 
            data = CHAT_COLLECTION.find_one(filter_query)
            json_data_with_backslashes = json_util.dumps(data)
            json_data = json.loads(json_data_with_backslashes)
            for k, web in WEBSOCKET_STORE.items():
                try:
                    if k == friend_email+"_|_"+my_email or k == my_email+"_|_"+friend_email:
                        print("Data sendign to:", k, web)
                        await web.send_json({'msg': "Success", "data": json_data['chats'], "status": "OK"})
                    else:
                        print("="*80)
                        print(k, web)
                        print("="*80)
                except:
                    print("EXCEPTION OCCURED")
            print("The Webstore:", WEBSOCKET_STORE)
            print("Just enter to chatroom, No need save in database")
          


@app.post("/getChat")
def getChat(res: str=Depends(verify_token), friend_email: str=Form()):
    if res['result'] == True:
        my_email = res['data']['email']
        filter_query = {"$or": [{"chatroomid": my_email+"_|_"+friend_email}, {"chatroomid": friend_email+"_|_"+my_email}]} 
        data = CHAT_COLLECTION.find_one(filter_query)
        json_data_with_backslashes = json_util.dumps(data)
        json_data = json.loads(json_data_with_backslashes)
        return {'msg': "Success", "data": json_data['chats'], "status": "OK"}
    else:
        return {'msg': res['msg'], "status": "ERROR"}



