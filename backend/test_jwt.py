from jose import JWTError, jwt

SECRET_KEY = "mysecretkey"

token = jwt.encode({"user_id": 1}, SECRET_KEY, algorithm="HS256")
print("JWT Token:", token)


decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
print("Decoded Payload:", decoded) 