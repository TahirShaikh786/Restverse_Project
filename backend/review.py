from pymongo import MongoClient
import json

MONGO_URI = "mongodb+srv://tahirshaikh:t.s12345@cluster0.nribz.mongodb.net/reviewData?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["ReviewDB"]
reviews_collection = db["businesss"]

reviews_file_path = r"C:\Users\ms828\OneDrive\Desktop\Tahir\Restaverse\backend\Data\api_data.json"

# Read data from JSON file and insert into MongoDB collection
try:
    with open(reviews_file_path, 'r') as file:
        reviews_data = json.load(file)

    # Delete all existing data from MongoDB collection Before inserting
    reviews_collection.delete_many({})

    # Insert data into MongoDB collection
    result = reviews_collection.insert_many(reviews_data)
    print(f"Data inserted successfully! Inserted IDs: {result.inserted_ids}")

except Exception as e:
    print(f"Error: {e}")