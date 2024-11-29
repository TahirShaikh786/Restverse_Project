from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
from pymongo import MongoClient
from models import UserSchema
from marshmallow import ValidationError

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)  

# Initialize MongoDB
MONGO_URI = "mongodb+srv://tahirshaikh:t.s12345@cluster0.nribz.mongodb.net/reviewData?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["ReviewDB"]
users_collection = db["users"]
reviews_collection = db["businesss"]

user_schema = UserSchema()

@app.route("/api/save_user", methods=["POST"])
def save_user():
    try:
        user_data = request.json
        existing_user = users_collection.find_one({"email": user_data.get("email")})
        if existing_user:
            return jsonify({"message": "already exists"}), 200 
        # Validate and save user if not exists
        validated_data = user_schema.load(user_data)
        print("Validated data:", validated_data)
        validated_data['picture'] = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
        print("Validated data:", validated_data)
        users_collection.insert_one(validated_data)
        return jsonify({"message": "User saved successfully"}), 201
    except ValidationError as ve:
        return jsonify({"error": ve.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/reviews", methods=["GET"])
def get_reviews():
    try:
        name = request.args
        business_name = name.get("businessName")
        
        # Query MongoDB to find the business
        find_business = reviews_collection.find_one({"businessName": business_name})
        
        if find_business:
            # Convert ObjectId to string (to make it JSON serializable)
            find_business["_id"] = str(find_business["_id"])
            return jsonify(find_business)
        else:
            return jsonify({"message": "Business not found"}), 404
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred"}), 500

if __name__ == "__main__":
    app.run(debug=True)
