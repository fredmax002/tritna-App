"""
TRITNA Backend API - Fully Functional
=====================================
A complete backend for the TRITNA super-app with:
- User Authentication (Phone + OTP)
- Wallet Management
- RAYD (Ride-hailing)
- FOOD (Food ordering)
- ENJOYMENT (Events & Tickets)
- OS (Housing & Rentals)
- MAKIT (Marketplace)
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
import os
import random
import string
import hashlib
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TRITNA API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.tritna_db

# Helper to convert ObjectId to string
def serialize_doc(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

# ============== MODELS ==============

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v, field=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

# Auth Models
class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None

# Wallet Models
class AddMoneyRequest(BaseModel):
    amount: float
    payment_method: str  # afrimoney, orange_money, visa, cash

class WithdrawRequest(BaseModel):
    amount: float
    payment_method: str

class SendMoneyRequest(BaseModel):
    phone: str
    amount: float

class PayServiceRequest(BaseModel):
    amount: float
    service: str
    description: str

# RAYD Models
class BookRideRequest(BaseModel):
    pickup_location: str
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    dropoff_location: str
    dropoff_lat: Optional[float] = None
    dropoff_lng: Optional[float] = None
    vehicle_type: str  # car, bike, keke
    payment_method: str

# FOOD Models
class CartItem(BaseModel):
    item_id: str
    name: str
    quantity: int
    price: float

class PlaceFoodOrderRequest(BaseModel):
    restaurant_id: str
    items: List[CartItem]
    delivery_address: str
    payment_method: str

# ENJOYMENT Models
class BuyTicketRequest(BaseModel):
    event_id: str
    quantity: int
    payment_method: str

# OS Models
class BookPropertyRequest(BaseModel):
    property_id: str
    check_in: str
    check_out: str
    guests: int
    payment_method: str

# MAKIT Models
class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int

class PlaceMarketOrderRequest(BaseModel):
    items: List[dict]
    delivery_address: str
    payment_method: str

# ============== DATABASE INITIALIZATION ==============

async def init_sample_data():
    """Initialize sample data if database is empty"""
    
    # Check if data already exists
    restaurant_count = await db.restaurants.count_documents({})
    if restaurant_count > 0:
        return
    
    # Sample Restaurants
    restaurants = [
        {
            "name": "Mama's Kitchen",
            "cuisine": "African",
            "rating": 4.8,
            "delivery_time": "25-35 min",
            "delivery_fee": 5000,
            "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
            "menu": [
                {"id": "m1", "name": "Jollof Rice", "price": 35000, "description": "Classic West African rice dish"},
                {"id": "m2", "name": "Cassava Leaves", "price": 40000, "description": "Traditional cassava leaf stew"},
                {"id": "m3", "name": "Fufu & Soup", "price": 45000, "description": "Pounded yam with palm nut soup"},
                {"id": "m4", "name": "Grilled Fish", "price": 55000, "description": "Fresh fish with spices"},
            ],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Crown Xpress",
            "cuisine": "Fast Food",
            "rating": 4.5,
            "delivery_time": "20-30 min",
            "delivery_fee": 3000,
            "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330",
            "menu": [
                {"id": "m5", "name": "Chicken Burger", "price": 28000, "description": "Crispy chicken with fresh veggies"},
                {"id": "m6", "name": "Beef Shawarma", "price": 25000, "description": "Grilled beef wrap"},
                {"id": "m7", "name": "French Fries", "price": 12000, "description": "Crispy golden fries"},
                {"id": "m8", "name": "Pizza Margherita", "price": 45000, "description": "Classic cheese pizza"},
            ],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Golden Dragon",
            "cuisine": "Chinese",
            "rating": 4.6,
            "delivery_time": "30-40 min",
            "delivery_fee": 4000,
            "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9",
            "menu": [
                {"id": "m9", "name": "Fried Rice", "price": 32000, "description": "Special fried rice with vegetables"},
                {"id": "m10", "name": "Sweet & Sour Chicken", "price": 42000, "description": "Crispy chicken in tangy sauce"},
                {"id": "m11", "name": "Spring Rolls", "price": 18000, "description": "Crispy vegetable rolls"},
                {"id": "m12", "name": "Chow Mein", "price": 35000, "description": "Stir-fried noodles"},
            ],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Lagoonda Restaurant",
            "cuisine": "Continental",
            "rating": 4.7,
            "delivery_time": "35-45 min",
            "delivery_fee": 5000,
            "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "menu": [
                {"id": "m13", "name": "Grilled Steak", "price": 85000, "description": "Premium beef steak"},
                {"id": "m14", "name": "Seafood Pasta", "price": 65000, "description": "Pasta with mixed seafood"},
                {"id": "m15", "name": "Caesar Salad", "price": 28000, "description": "Fresh romaine with dressing"},
                {"id": "m16", "name": "Chicken Alfredo", "price": 55000, "description": "Creamy pasta with chicken"},
            ],
            "created_at": datetime.utcnow()
        }
    ]
    await db.restaurants.insert_many(restaurants)
    
    # Sample Events
    events = [
        {
            "title": "Freetown Music Festival 2024",
            "description": "The biggest music festival in Sierra Leone featuring local and international artists.",
            "date": "2024-12-15",
            "time": "18:00",
            "venue": "National Stadium, Freetown",
            "category": "Concert",
            "price": 150000,
            "tickets_available": 500,
            "image": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
            "featured": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "DJ Night at Club X",
            "description": "Experience the best DJs in town spinning the hottest tracks.",
            "date": "2024-12-20",
            "time": "22:00",
            "venue": "Club X, Lumley",
            "category": "Nightlife",
            "price": 50000,
            "tickets_available": 150,
            "image": "https://images.unsplash.com/photo-1571266028243-d220c6a9ce64",
            "featured": False,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Sierra Leone Premier League",
            "description": "FC Kallon vs East End Lions - The big derby match!",
            "date": "2024-12-22",
            "time": "15:00",
            "venue": "Siaka Stevens Stadium",
            "category": "Sports",
            "price": 25000,
            "tickets_available": 1000,
            "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
            "featured": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "New Year's Eve Countdown Party",
            "description": "Ring in 2025 with the biggest party in Freetown!",
            "date": "2024-12-31",
            "time": "21:00",
            "venue": "Radisson Blu Hotel",
            "category": "Festival",
            "price": 200000,
            "tickets_available": 300,
            "image": "https://images.unsplash.com/photo-1467810563316-b5476525c0f9",
            "featured": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.events.insert_many(events)
    
    # Sample Venues
    venues = [
        {"name": "Club X", "type": "Nightclub", "rating": 4.8, "address": "Lumley Beach Road"},
        {"name": "The Hub", "type": "Lounge", "rating": 4.6, "address": "Aberdeen"},
        {"name": "Beach Bar", "type": "Beach Club", "rating": 4.7, "address": "Tokeh Beach"},
        {"name": "Sky Lounge", "type": "Rooftop", "rating": 4.9, "address": "Hill Station"},
    ]
    await db.venues.insert_many(venues)
    
    # Sample Properties
    properties = [
        {
            "title": "Modern 3BR Apartment",
            "description": "Spacious modern apartment with stunning ocean views",
            "location": "Aberdeen, Freetown",
            "price_per_night": 450000,
            "rating": 4.9,
            "bedrooms": 3,
            "bathrooms": 2,
            "max_guests": 6,
            "property_type": "Apartment",
            "amenities": ["WiFi", "AC", "Pool", "Parking", "Kitchen", "TV"],
            "images": ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"],
            "host_name": "Ibrahim K.",
            "available": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Cozy Studio with Ocean View",
            "description": "Perfect for couples, steps away from Lumley Beach",
            "location": "Lumley Beach Road",
            "price_per_night": 200000,
            "rating": 4.7,
            "bedrooms": 1,
            "bathrooms": 1,
            "max_guests": 2,
            "property_type": "Studio",
            "amenities": ["WiFi", "AC", "Kitchen", "Beach Access"],
            "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
            "host_name": "Mariama S.",
            "available": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Luxury Villa with Garden",
            "description": "Elegant villa with private garden and security",
            "location": "Hill Station",
            "price_per_night": 800000,
            "rating": 4.8,
            "bedrooms": 5,
            "bathrooms": 4,
            "max_guests": 10,
            "property_type": "Villa",
            "amenities": ["WiFi", "Pool", "Garden", "Security", "Generator", "Parking"],
            "images": ["https://images.unsplash.com/photo-1613977257363-707ba9348227"],
            "host_name": "Mohamed B.",
            "available": True,
            "created_at": datetime.utcnow()
        },
        {
            "title": "Event Space - The Grand Hall",
            "description": "Perfect for weddings, conferences, and large events",
            "location": "Wilkinson Road",
            "price_per_night": 2500000,
            "rating": 4.9,
            "bedrooms": 0,
            "bathrooms": 4,
            "max_guests": 200,
            "property_type": "Event Space",
            "amenities": ["AC", "Sound System", "Projector", "Catering Kitchen", "Parking"],
            "images": ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3"],
            "host_name": "TRITNA Events",
            "available": True,
            "created_at": datetime.utcnow()
        }
    ]
    await db.properties.insert_many(properties)
    
    # Sample Products
    products = [
        {
            "name": "iPhone 15 Pro",
            "description": "Latest Apple smartphone with A17 chip",
            "price": 8500000,
            "category": "Electronics",
            "rating": 4.9,
            "stock": 15,
            "seller": "TechZone SL",
            "images": ["https://images.unsplash.com/photo-1695048133142-1a20484d2569"],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Nike Air Max",
            "description": "Premium sneakers for everyday comfort",
            "price": 580000,
            "category": "Fashion",
            "rating": 4.7,
            "stock": 30,
            "seller": "Footwear Hub",
            "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Samsung 55\" Smart TV",
            "description": "4K Ultra HD Smart Television",
            "price": 3200000,
            "category": "Electronics",
            "rating": 4.8,
            "stock": 10,
            "seller": "Electronics World",
            "images": ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1"],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Leather Handbag",
            "description": "Genuine leather designer handbag",
            "price": 450000,
            "category": "Fashion",
            "rating": 4.6,
            "stock": 25,
            "seller": "Fashion Forward",
            "images": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa"],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Bluetooth Speaker JBL",
            "description": "Portable waterproof speaker with deep bass",
            "price": 280000,
            "category": "Electronics",
            "rating": 4.5,
            "stock": 40,
            "seller": "TechZone SL",
            "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1"],
            "created_at": datetime.utcnow()
        },
        {
            "name": "Kitchen Blender",
            "description": "High-power blender for smoothies and more",
            "price": 350000,
            "category": "Home",
            "rating": 4.4,
            "stock": 20,
            "seller": "Home Essentials",
            "images": ["https://images.unsplash.com/photo-1570222094114-d054a817e56b"],
            "created_at": datetime.utcnow()
        }
    ]
    await db.products.insert_many(products)
    
    # Vehicle Types
    vehicle_types = [
        {"type": "car", "name": "Car", "base_fare": 15000, "per_km": 3000, "image": "car"},
        {"type": "bike", "name": "Bike", "base_fare": 8000, "per_km": 1500, "image": "bicycle"},
        {"type": "keke", "name": "Keke", "base_fare": 10000, "per_km": 2000, "image": "bus"},
    ]
    await db.vehicle_types.insert_many(vehicle_types)
    
    print("Sample data initialized successfully!")

@app.on_event("startup")
async def startup_event():
    await init_sample_data()

# ============== AUTH ENDPOINTS ==============

@app.post("/api/auth/send-otp")
async def send_otp(request: SendOTPRequest):
    """Send OTP to phone number"""
    phone = request.phone.strip()
    
    # Generate 4-digit OTP
    otp = ''.join(random.choices(string.digits, k=4))
    
    # Store OTP in database (expires in 5 minutes)
    await db.otps.update_one(
        {"phone": phone},
        {
            "$set": {
                "otp": otp,
                "created_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + timedelta(minutes=5)
            }
        },
        upsert=True
    )
    
    # In production, send actual SMS here
    # For now, we'll return success and the OTP (for testing)
    return {
        "success": True,
        "message": f"OTP sent to +232 {phone}",
        "otp": otp  # Remove this in production!
    }

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    """Verify OTP and login/register user"""
    phone = request.phone.strip()
    
    # Find OTP record
    otp_record = await db.otps.find_one({"phone": phone})
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="OTP not found. Please request a new one.")
    
    if otp_record["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
    
    if otp_record["otp"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Delete used OTP
    await db.otps.delete_one({"phone": phone})
    
    # Check if user exists
    user = await db.users.find_one({"phone": phone})
    
    if user:
        # Existing user - login
        return {
            "success": True,
            "message": "Login successful",
            "user": serialize_doc(user),
            "is_new_user": False
        }
    else:
        # New user - register
        if not request.first_name:
            raise HTTPException(status_code=400, detail="First name is required for new users")
        
        new_user = {
            "phone": phone,
            "first_name": request.first_name,
            "last_name": request.last_name or "",
            "email": request.email,
            "role": "user",
            "created_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(new_user)
        new_user["_id"] = result.inserted_id
        
        # Create wallet for new user
        await db.wallets.insert_one({
            "user_id": result.inserted_id,
            "balance": 0,
            "created_at": datetime.utcnow()
        })
        
        return {
            "success": True,
            "message": "Registration successful",
            "user": serialize_doc(new_user),
            "is_new_user": True
        }

@app.get("/api/auth/user/{user_id}")
async def get_user(user_id: str):
    """Get user profile"""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return serialize_doc(user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/auth/user/{user_id}")
async def update_user(user_id: str, request: UpdateProfileRequest):
    """Update user profile"""
    update_data = {}
    if request.first_name:
        update_data["first_name"] = request.first_name
    if request.last_name:
        update_data["last_name"] = request.last_name
    if request.email:
        update_data["email"] = request.email
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return serialize_doc(user)

# ============== WALLET ENDPOINTS ==============

@app.get("/api/wallet/{user_id}")
async def get_wallet(user_id: str):
    """Get user wallet balance and transactions"""
    try:
        wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        if not wallet:
            # Create wallet if doesn't exist
            wallet = {
                "user_id": ObjectId(user_id),
                "balance": 0,
                "created_at": datetime.utcnow()
            }
            await db.wallets.insert_one(wallet)
        
        # Get transactions
        transactions = await db.transactions.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(50).to_list(50)
        
        return {
            "balance": wallet.get("balance", 0),
            "transactions": serialize_docs(transactions)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/wallet/{user_id}/add-money")
async def add_money(user_id: str, request: AddMoneyRequest):
    """Add money to wallet"""
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    try:
        # Update wallet balance
        result = await db.wallets.update_one(
            {"user_id": ObjectId(user_id)},
            {"$inc": {"balance": request.amount}},
            upsert=True
        )
        
        # Record transaction
        transaction = {
            "user_id": ObjectId(user_id),
            "type": "credit",
            "amount": request.amount,
            "description": "Wallet Top-up",
            "payment_method": request.payment_method,
            "status": "completed",
            "created_at": datetime.utcnow()
        }
        await db.transactions.insert_one(transaction)
        
        # Get updated wallet
        wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        
        return {
            "success": True,
            "message": f"SLE {request.amount:,.0f} added successfully",
            "new_balance": wallet["balance"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/wallet/{user_id}/withdraw")
async def withdraw_money(user_id: str, request: WithdrawRequest):
    """Withdraw money from wallet"""
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    try:
        wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        if not wallet or wallet.get("balance", 0) < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Update wallet balance
        await db.wallets.update_one(
            {"user_id": ObjectId(user_id)},
            {"$inc": {"balance": -request.amount}}
        )
        
        # Record transaction
        transaction = {
            "user_id": ObjectId(user_id),
            "type": "debit",
            "amount": request.amount,
            "description": f"Withdrawal to {request.payment_method}",
            "payment_method": request.payment_method,
            "status": "completed",
            "created_at": datetime.utcnow()
        }
        await db.transactions.insert_one(transaction)
        
        wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        
        return {
            "success": True,
            "message": f"SLE {request.amount:,.0f} withdrawn successfully",
            "new_balance": wallet["balance"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/wallet/{user_id}/send")
async def send_money(user_id: str, request: SendMoneyRequest):
    """Send money to another user"""
    if request.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    try:
        # Check sender balance
        sender_wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        if not sender_wallet or sender_wallet.get("balance", 0) < request.amount:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        
        # Find recipient
        recipient = await db.users.find_one({"phone": request.phone})
        if not recipient:
            raise HTTPException(status_code=404, detail="Recipient not found")
        
        if str(recipient["_id"]) == user_id:
            raise HTTPException(status_code=400, detail="Cannot send money to yourself")
        
        # Deduct from sender
        await db.wallets.update_one(
            {"user_id": ObjectId(user_id)},
            {"$inc": {"balance": -request.amount}}
        )
        
        # Add to recipient
        await db.wallets.update_one(
            {"user_id": recipient["_id"]},
            {"$inc": {"balance": request.amount}},
            upsert=True
        )
        
        # Record transactions
        await db.transactions.insert_one({
            "user_id": ObjectId(user_id),
            "type": "debit",
            "amount": request.amount,
            "description": f"Sent to +232 {request.phone}",
            "payment_method": "wallet",
            "status": "completed",
            "created_at": datetime.utcnow()
        })
        
        await db.transactions.insert_one({
            "user_id": recipient["_id"],
            "type": "credit",
            "amount": request.amount,
            "description": f"Received from transfer",
            "payment_method": "wallet",
            "status": "completed",
            "created_at": datetime.utcnow()
        })
        
        sender_wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
        
        return {
            "success": True,
            "message": f"SLE {request.amount:,.0f} sent to +232 {request.phone}",
            "new_balance": sender_wallet["balance"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== RAYD (RIDE) ENDPOINTS ==============

@app.get("/api/rayd/vehicles")
async def get_vehicle_types():
    """Get available vehicle types"""
    vehicles = await db.vehicle_types.find({}).to_list(10)
    return serialize_docs(vehicles)

@app.post("/api/rayd/book/{user_id}")
async def book_ride(user_id: str, request: BookRideRequest):
    """Book a ride"""
    try:
        # Get vehicle type pricing
        vehicle = await db.vehicle_types.find_one({"type": request.vehicle_type})
        if not vehicle:
            raise HTTPException(status_code=400, detail="Invalid vehicle type")
        
        # Calculate estimated fare (simplified - in production use actual distance)
        estimated_distance = random.uniform(3, 15)  # km
        fare = vehicle["base_fare"] + (vehicle["per_km"] * estimated_distance)
        fare = round(fare / 1000) * 1000  # Round to nearest 1000
        
        # Check wallet balance if paying with wallet
        if request.payment_method == "wallet":
            wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
            if not wallet or wallet.get("balance", 0) < fare:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
        
        # Create ride
        ride = {
            "user_id": ObjectId(user_id),
            "pickup_location": request.pickup_location,
            "pickup_lat": request.pickup_lat,
            "pickup_lng": request.pickup_lng,
            "dropoff_location": request.dropoff_location,
            "dropoff_lat": request.dropoff_lat,
            "dropoff_lng": request.dropoff_lng,
            "vehicle_type": request.vehicle_type,
            "estimated_fare": fare,
            "estimated_distance": round(estimated_distance, 1),
            "payment_method": request.payment_method,
            "status": "searching",  # searching, accepted, arriving, in_progress, completed, cancelled
            "driver": {
                "name": f"Driver {random.randint(100, 999)}",
                "phone": f"07{random.randint(1000000, 9999999)}",
                "rating": round(random.uniform(4.2, 5.0), 1),
                "vehicle_number": f"AKJ-{random.randint(100, 999)}"
            },
            "created_at": datetime.utcnow()
        }
        
        result = await db.rides.insert_one(ride)
        ride["_id"] = result.inserted_id
        
        # Simulate driver acceptance (in production, this would be real-time)
        await db.rides.update_one(
            {"_id": result.inserted_id},
            {"$set": {"status": "accepted", "eta_minutes": random.randint(2, 8)}}
        )
        
        return {
            "success": True,
            "message": "Ride booked successfully",
            "ride": serialize_doc(ride),
            "eta_minutes": random.randint(2, 8)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/rayd/rides/{user_id}")
async def get_rides(user_id: str):
    """Get user's ride history"""
    try:
        rides = await db.rides.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(20).to_list(20)
        return serialize_docs(rides)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/rayd/rides/{ride_id}/complete")
async def complete_ride(ride_id: str, user_id: str):
    """Complete a ride and process payment"""
    try:
        ride = await db.rides.find_one({"_id": ObjectId(ride_id)})
        if not ride:
            raise HTTPException(status_code=404, detail="Ride not found")
        
        if ride["payment_method"] == "wallet":
            # Deduct from wallet
            await db.wallets.update_one(
                {"user_id": ride["user_id"]},
                {"$inc": {"balance": -ride["estimated_fare"]}}
            )
            
            # Record transaction
            await db.transactions.insert_one({
                "user_id": ride["user_id"],
                "type": "debit",
                "amount": ride["estimated_fare"],
                "description": f"TRITNA RAYD - {ride['pickup_location']} to {ride['dropoff_location']}",
                "payment_method": "wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            })
        
        # Update ride status
        await db.rides.update_one(
            {"_id": ObjectId(ride_id)},
            {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
        )
        
        return {"success": True, "message": "Ride completed"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/rayd/rides/{ride_id}/cancel")
async def cancel_ride(ride_id: str):
    """Cancel a ride"""
    try:
        result = await db.rides.update_one(
            {"_id": ObjectId(ride_id), "status": {"$in": ["searching", "accepted", "arriving"]}},
            {"$set": {"status": "cancelled", "cancelled_at": datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Cannot cancel this ride")
        
        return {"success": True, "message": "Ride cancelled"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== FOOD ENDPOINTS ==============

@app.get("/api/food/restaurants")
async def get_restaurants(category: Optional[str] = None):
    """Get all restaurants"""
    query = {}
    if category and category != "All":
        query["cuisine"] = category
    
    restaurants = await db.restaurants.find(query).to_list(50)
    return serialize_docs(restaurants)

@app.get("/api/food/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: str):
    """Get restaurant details with menu"""
    try:
        restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return serialize_doc(restaurant)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/food/categories")
async def get_food_categories():
    """Get food categories"""
    return [
        {"id": "all", "name": "All"},
        {"id": "african", "name": "African"},
        {"id": "fast_food", "name": "Fast Food"},
        {"id": "chinese", "name": "Chinese"},
        {"id": "continental", "name": "Continental"},
    ]

@app.post("/api/food/orders/{user_id}")
async def place_food_order(user_id: str, request: PlaceFoodOrderRequest):
    """Place a food order"""
    try:
        # Get restaurant
        restaurant = await db.restaurants.find_one({"_id": ObjectId(request.restaurant_id)})
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        
        # Calculate total
        subtotal = sum(item.price * item.quantity for item in request.items)
        delivery_fee = restaurant.get("delivery_fee", 5000)
        total = subtotal + delivery_fee
        
        # Check wallet balance if paying with wallet
        if request.payment_method == "wallet":
            wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
            if not wallet or wallet.get("balance", 0) < total:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
            
            # Deduct from wallet
            await db.wallets.update_one(
                {"user_id": ObjectId(user_id)},
                {"$inc": {"balance": -total}}
            )
            
            # Record transaction
            await db.transactions.insert_one({
                "user_id": ObjectId(user_id),
                "type": "debit",
                "amount": total,
                "description": f"TRITNA FOOD - {restaurant['name']}",
                "payment_method": "wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            })
        
        # Create order
        order = {
            "user_id": ObjectId(user_id),
            "restaurant_id": ObjectId(request.restaurant_id),
            "restaurant_name": restaurant["name"],
            "items": [item.dict() for item in request.items],
            "subtotal": subtotal,
            "delivery_fee": delivery_fee,
            "total": total,
            "delivery_address": request.delivery_address,
            "payment_method": request.payment_method,
            "status": "confirmed",  # confirmed, preparing, out_for_delivery, delivered
            "estimated_delivery": restaurant.get("delivery_time", "30-45 min"),
            "created_at": datetime.utcnow()
        }
        
        result = await db.food_orders.insert_one(order)
        order["_id"] = result.inserted_id
        
        return {
            "success": True,
            "message": "Order placed successfully",
            "order": serialize_doc(order)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/food/orders/{user_id}")
async def get_food_orders(user_id: str):
    """Get user's food order history"""
    try:
        orders = await db.food_orders.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(20).to_list(20)
        return serialize_docs(orders)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== ENJOYMENT (EVENTS) ENDPOINTS ==============

@app.get("/api/enjoyment/events")
async def get_events(category: Optional[str] = None):
    """Get all events"""
    query = {}
    if category:
        query["category"] = category
    
    events = await db.events.find(query).sort("date", 1).to_list(50)
    return serialize_docs(events)

@app.get("/api/enjoyment/events/{event_id}")
async def get_event(event_id: str):
    """Get event details"""
    try:
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return serialize_doc(event)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/enjoyment/venues")
async def get_venues():
    """Get all venues"""
    venues = await db.venues.find({}).to_list(50)
    return serialize_docs(venues)

@app.post("/api/enjoyment/tickets/{user_id}")
async def buy_ticket(user_id: str, request: BuyTicketRequest):
    """Buy event tickets"""
    try:
        # Get event
        event = await db.events.find_one({"_id": ObjectId(request.event_id)})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        if event["tickets_available"] < request.quantity:
            raise HTTPException(status_code=400, detail="Not enough tickets available")
        
        total = event["price"] * request.quantity
        
        # Check wallet balance if paying with wallet
        if request.payment_method == "wallet":
            wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
            if not wallet or wallet.get("balance", 0) < total:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
            
            # Deduct from wallet
            await db.wallets.update_one(
                {"user_id": ObjectId(user_id)},
                {"$inc": {"balance": -total}}
            )
            
            # Record transaction
            await db.transactions.insert_one({
                "user_id": ObjectId(user_id),
                "type": "debit",
                "amount": total,
                "description": f"TRITNA ENJOYMENT - {event['title']}",
                "payment_method": "wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            })
        
        # Update ticket availability
        await db.events.update_one(
            {"_id": ObjectId(request.event_id)},
            {"$inc": {"tickets_available": -request.quantity}}
        )
        
        # Create ticket
        ticket = {
            "user_id": ObjectId(user_id),
            "event_id": ObjectId(request.event_id),
            "event_title": event["title"],
            "event_date": event["date"],
            "event_time": event["time"],
            "event_venue": event["venue"],
            "quantity": request.quantity,
            "total_price": total,
            "ticket_code": ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
            "payment_method": request.payment_method,
            "status": "confirmed",
            "created_at": datetime.utcnow()
        }
        
        result = await db.tickets.insert_one(ticket)
        ticket["_id"] = result.inserted_id
        
        return {
            "success": True,
            "message": "Tickets purchased successfully",
            "ticket": serialize_doc(ticket)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/enjoyment/tickets/{user_id}")
async def get_tickets(user_id: str):
    """Get user's tickets"""
    try:
        tickets = await db.tickets.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).to_list(50)
        return serialize_docs(tickets)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== OS (HOUSING) ENDPOINTS ==============

@app.get("/api/os/properties")
async def get_properties(property_type: Optional[str] = None):
    """Get all properties"""
    query = {"available": True}
    if property_type:
        query["property_type"] = property_type
    
    properties = await db.properties.find(query).to_list(50)
    return serialize_docs(properties)

@app.get("/api/os/properties/{property_id}")
async def get_property(property_id: str):
    """Get property details"""
    try:
        property = await db.properties.find_one({"_id": ObjectId(property_id)})
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        return serialize_doc(property)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/os/bookings/{user_id}")
async def book_property(user_id: str, request: BookPropertyRequest):
    """Book a property"""
    try:
        # Get property
        property = await db.properties.find_one({"_id": ObjectId(request.property_id)})
        if not property:
            raise HTTPException(status_code=404, detail="Property not found")
        
        if not property.get("available", True):
            raise HTTPException(status_code=400, detail="Property not available")
        
        # Calculate total (simplified - assumes dates are valid)
        check_in = datetime.strptime(request.check_in, "%Y-%m-%d")
        check_out = datetime.strptime(request.check_out, "%Y-%m-%d")
        nights = (check_out - check_in).days
        
        if nights <= 0:
            raise HTTPException(status_code=400, detail="Invalid dates")
        
        total = property["price_per_night"] * nights
        
        # Check wallet balance if paying with wallet
        if request.payment_method == "wallet":
            wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
            if not wallet or wallet.get("balance", 0) < total:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
            
            # Deduct from wallet
            await db.wallets.update_one(
                {"user_id": ObjectId(user_id)},
                {"$inc": {"balance": -total}}
            )
            
            # Record transaction
            await db.transactions.insert_one({
                "user_id": ObjectId(user_id),
                "type": "debit",
                "amount": total,
                "description": f"TRITNA OS - {property['title']}",
                "payment_method": "wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            })
        
        # Create booking
        booking = {
            "user_id": ObjectId(user_id),
            "property_id": ObjectId(request.property_id),
            "property_title": property["title"],
            "property_location": property["location"],
            "check_in": request.check_in,
            "check_out": request.check_out,
            "nights": nights,
            "guests": request.guests,
            "price_per_night": property["price_per_night"],
            "total_price": total,
            "payment_method": request.payment_method,
            "status": "confirmed",
            "booking_code": ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
            "host_name": property.get("host_name", "Host"),
            "created_at": datetime.utcnow()
        }
        
        result = await db.property_bookings.insert_one(booking)
        booking["_id"] = result.inserted_id
        
        return {
            "success": True,
            "message": "Booking confirmed",
            "booking": serialize_doc(booking)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/os/bookings/{user_id}")
async def get_property_bookings(user_id: str):
    """Get user's property bookings"""
    try:
        bookings = await db.property_bookings.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).to_list(50)
        return serialize_docs(bookings)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== MAKIT (MARKETPLACE) ENDPOINTS ==============

@app.get("/api/makit/products")
async def get_products(category: Optional[str] = None):
    """Get all products"""
    query = {}
    if category and category != "All":
        query["category"] = category
    
    products = await db.products.find(query).to_list(50)
    return serialize_docs(products)

@app.get("/api/makit/products/{product_id}")
async def get_product(product_id: str):
    """Get product details"""
    try:
        product = await db.products.find_one({"_id": ObjectId(product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return serialize_doc(product)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/makit/categories")
async def get_product_categories():
    """Get product categories"""
    return [
        {"id": "all", "name": "All"},
        {"id": "electronics", "name": "Electronics"},
        {"id": "fashion", "name": "Fashion"},
        {"id": "home", "name": "Home"},
        {"id": "beauty", "name": "Beauty"},
    ]

@app.get("/api/makit/cart/{user_id}")
async def get_cart(user_id: str):
    """Get user's cart"""
    try:
        cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
        if not cart:
            return {"items": [], "total": 0}
        return serialize_doc(cart)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/makit/cart/{user_id}")
async def add_to_cart(user_id: str, request: AddToCartRequest):
    """Add item to cart"""
    try:
        # Get product
        product = await db.products.find_one({"_id": ObjectId(request.product_id)})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if product["stock"] < request.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")
        
        cart_item = {
            "product_id": request.product_id,
            "name": product["name"],
            "price": product["price"],
            "quantity": request.quantity,
            "image": product.get("images", [""])[0] if product.get("images") else ""
        }
        
        # Update or create cart
        cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
        
        if cart:
            # Check if item already in cart
            existing_item_idx = next(
                (i for i, item in enumerate(cart.get("items", [])) if item["product_id"] == request.product_id),
                None
            )
            
            if existing_item_idx is not None:
                # Update quantity
                await db.carts.update_one(
                    {"user_id": ObjectId(user_id)},
                    {"$set": {f"items.{existing_item_idx}.quantity": cart["items"][existing_item_idx]["quantity"] + request.quantity}}
                )
            else:
                # Add new item
                await db.carts.update_one(
                    {"user_id": ObjectId(user_id)},
                    {"$push": {"items": cart_item}}
                )
        else:
            # Create new cart
            await db.carts.insert_one({
                "user_id": ObjectId(user_id),
                "items": [cart_item],
                "created_at": datetime.utcnow()
            })
        
        # Get updated cart
        cart = await db.carts.find_one({"user_id": ObjectId(user_id)})
        total = sum(item["price"] * item["quantity"] for item in cart.get("items", []))
        
        return {
            "success": True,
            "message": "Item added to cart",
            "cart_count": len(cart.get("items", [])),
            "cart_total": total
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/makit/cart/{user_id}/{product_id}")
async def remove_from_cart(user_id: str, product_id: str):
    """Remove item from cart"""
    try:
        await db.carts.update_one(
            {"user_id": ObjectId(user_id)},
            {"$pull": {"items": {"product_id": product_id}}}
        )
        return {"success": True, "message": "Item removed from cart"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/makit/orders/{user_id}")
async def place_market_order(user_id: str, request: PlaceMarketOrderRequest):
    """Place a marketplace order"""
    try:
        # Calculate total
        total = sum(item.get("price", 0) * item.get("quantity", 1) for item in request.items)
        
        if total <= 0:
            raise HTTPException(status_code=400, detail="Invalid order")
        
        # Check wallet balance if paying with wallet
        if request.payment_method == "wallet":
            wallet = await db.wallets.find_one({"user_id": ObjectId(user_id)})
            if not wallet or wallet.get("balance", 0) < total:
                raise HTTPException(status_code=400, detail="Insufficient wallet balance")
            
            # Deduct from wallet
            await db.wallets.update_one(
                {"user_id": ObjectId(user_id)},
                {"$inc": {"balance": -total}}
            )
            
            # Record transaction
            await db.transactions.insert_one({
                "user_id": ObjectId(user_id),
                "type": "debit",
                "amount": total,
                "description": f"TRITNA MAKIT - Order",
                "payment_method": "wallet",
                "status": "completed",
                "created_at": datetime.utcnow()
            })
        
        # Create order
        order = {
            "user_id": ObjectId(user_id),
            "items": request.items,
            "total": total,
            "delivery_address": request.delivery_address,
            "payment_method": request.payment_method,
            "status": "confirmed",
            "order_number": ''.join(random.choices(string.digits, k=8)),
            "created_at": datetime.utcnow()
        }
        
        result = await db.market_orders.insert_one(order)
        order["_id"] = result.inserted_id
        
        # Clear cart
        await db.carts.delete_one({"user_id": ObjectId(user_id)})
        
        # Update product stock
        for item in request.items:
            await db.products.update_one(
                {"_id": ObjectId(item.get("product_id"))},
                {"$inc": {"stock": -item.get("quantity", 1)}}
            )
        
        return {
            "success": True,
            "message": "Order placed successfully",
            "order": serialize_doc(order)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/makit/orders/{user_id}")
async def get_market_orders(user_id: str):
    """Get user's marketplace orders"""
    try:
        orders = await db.market_orders.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(20).to_list(20)
        return serialize_docs(orders)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============== HEALTH CHECK ==============

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "TRITNA API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
