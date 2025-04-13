from flask import (
    Flask,
    request,
    jsonify,
    render_template,
    session,
    redirect,
    url_for,
    send_file,
)
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
import cv2
import time
from datetime import datetime
from functools import wraps

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = "static/uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("serve_login"))
        return f(*args, **kwargs)

    return decorated_function


# ---------- Database Setup ----------


def init_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password TEXT
        )
    """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            type TEXT,
            amount REAL,
            category TEXT,
            description TEXT,
            date TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """
    )

    conn.commit()
    conn.close()


init_db()

# ---------- Routes ----------


@app.route("/")
def serve_login():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return send_file("index.html")


@app.route("/signup")
def serve_signup():
    return render_template("signup.html")


@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("serve_login"))
    return (
        f"<h1>Welcome, {session.get('username')}! 🎉</h1><a href='/logout'>Logout</a>"
    )


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("serve_login"))


# ---------- Camera Routes ----------


@app.route("/capture", methods=["POST"])
@login_required
def capture_image():
    try:
        print("Initializing camera...")
        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            print("Could not access camera")
            return jsonify({"error": "Could not access camera"}), 500

        print("Waiting for camera to initialize...")
        time.sleep(1)

        print("Capturing frame...")
        ret, frame = cap.read()

        if not ret:
            print("Failed to capture image")
            return jsonify({"error": "Failed to capture image"}), 500

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"capture_{timestamp}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        print(f"Saving image to {filepath}")
        cv2.imwrite(filepath, frame)

        # Release the camera
        cap.release()
        print("Camera released")

        return (
            jsonify(
                {
                    "message": "Image captured successfully",
                    "filename": filename,
                    "url": f"/static/uploads/{filename}",
                }
            ),
            200,
        )

    except Exception as e:
        print(f"Error capturing image: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/camera-status")
@login_required
def camera_status():
    try:
        print("Checking camera status...")
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("Camera is available")
            cap.release()
            return jsonify({"status": "available"}), 200
        print("Camera is not available")
        return jsonify({"status": "unavailable"}), 404
    except Exception as e:
        print(f"Error checking camera status: {str(e)}")
        return jsonify({"status": "unavailable", "error": str(e)}), 404


@app.route("/upload-image", methods=["POST"])
@login_required
def upload_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"capture_{timestamp}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Save the image
        file.save(filepath)

        return (
            jsonify(
                {
                    "message": "Image uploaded successfully",
                    "filename": filename,
                    "url": f"/static/uploads/{filename}",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------- Auth APIs ----------


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user[3], password):
        session["user_id"] = user[0]
        session["username"] = user[1]
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = generate_password_hash(data["password"])

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    # Check if email exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return (
            jsonify({"message": "Email already registered. Please login instead."}),
            409,
        )

    # Check if username exists
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    if cursor.fetchone():
        conn.close()
        return (
            jsonify(
                {
                    "message": "Username already taken. Please choose a different username."
                }
            ),
            409,
        )

    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        (username, email, password),
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Account created successfully! Please login."}), 201


@app.route("/api/chat", methods=["POST"])
@login_required
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    # Get user's transactions for analysis
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT type, amount, category, description, date 
        FROM transactions 
        WHERE user_id = ?
        ORDER BY date DESC
    """,
        (session["user_id"],),
    )
    transactions = cursor.fetchall()
    conn.close()

    # Analyze transactions and generate response
    response = analyze_transactions(user_message, transactions)

    return jsonify({"response": response, "transactions": transactions})


def analyze_transactions(message, transactions):
    # Convert message to lowercase for easier matching
    message = message.lower()

    # Initialize response
    response = ""

    # Check for specific queries
    if "total spent" in message or "total expenses" in message:
        total = sum(t[1] for t in transactions if t[0] == "expense")
        response = f"Your total expenses are ₹{total:.2f}"

    elif "category" in message:
        # Group expenses by category
        categories = {}
        for t in transactions:
            if t[0] == "expense":
                cat = t[2]
                amount = t[1]
                categories[cat] = categories.get(cat, 0) + amount

        # Find highest spending category
        if categories:
            max_cat = max(categories.items(), key=lambda x: x[1])
            response = (
                f"Your highest spending category is {max_cat[0]} with ₹{max_cat[1]:.2f}"
            )
        else:
            response = "No expense categories found"

    elif "suggest" in message or "recommend" in message:
        # Analyze spending patterns and provide recommendations
        categories = {}
        for t in transactions:
            if t[0] == "expense":
                cat = t[2]
                amount = t[1]
                categories[cat] = categories.get(cat, 0) + amount

        if categories:
            # Find categories with high spending
            high_spending = [cat for cat, amount in categories.items() if amount > 1000]
            if high_spending:
                response = f"I notice you're spending a lot on {', '.join(high_spending)}. Consider setting budgets for these categories."
            else:
                response = "Your spending patterns look good! Keep maintaining your current budget."
        else:
            response = "No expense data available for recommendations"

    else:
        response = "I can help you analyze your expenses. Try asking about total expenses, category-wise spending, or recommendations for saving money."

    return response


# ---------- Run App ----------

if __name__ == "__main__":
    app.run(debug=True)
