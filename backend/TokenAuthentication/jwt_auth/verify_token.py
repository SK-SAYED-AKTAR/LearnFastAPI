from fastapi import Header
import jwt

KEY = "SAYED"
ALGORITHM = "HS256"
# EXPIRE = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

def verify_token(Authorization: str=Header(default=None)):
    if Authorization is None:
        return {"result":False ,"msg": "Token is required", "status": "Error"}
    else:
        mytoken = Authorization[7:]
        try:
            decode_token_data = jwt.decode(mytoken, KEY, ALGORITHM)
            return {"result":True ,"msg": "Token is valid", "data": dict(decode_token_data), "status": "OK"}
        except Exception as e:
            return {"result":False ,"msg": str(e), "status": "OK"}