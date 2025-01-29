from flask import Flask, render_template, request, redirect, flash, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = '1fd851d1b08629c9ad3c148d1b7243e7'  # Replace with a secure key

# Database configuration
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Ammulu7093",
    database="romewithus"
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/create_account', methods=['POST'])
def create_account():
    name = request.form['name']
    email = request.form['email']
    gender = request.form['gender']
    password = request.form['password']
    status = request.form['status']
    
    hashed_password = generate_password_hash(password, method='sha256')

    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO users (name, email, gender, password, status) VALUES (%s, %s, %s, %s, %s)",
                       (name, email, gender, hashed_password, status))
        db.commit()
        flash('Account created successfully! Please log in.')
    except mysql.connector.Error as err:
        flash(f"Error: {err}")
    finally:
        cursor.close()
    
    return redirect('/')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    
    if user and check_password_hash(user['password'], password):
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        flash('Login successful!')
        return redirect('/')
    else:
        flash('Invalid credentials, please try again.')
        return redirect('/')

@app.route('/rent_car', methods=['POST'])
def rent_car():
    user_id = session.get('user_id')
    if not user_id:
        flash('You must be logged in to rent a car.')
        return redirect('/')
    
    user_name = request.form['user_name']
    phone_no = request.form['phone_no']
    car_model = request.form['car_model']
    car_cost = request.form['car_cost']
    rental_start_date = request.form['rental_start_date']
    rental_end_date = request.form['rental_end_date']
    driver_required = request.form['driver_required']
    driver_selection = request.form['driver_selection']
    
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO car_rentals (user_id, user_name, phone_no, car_model, car_cost, rental_start_date, rental_end_date, driver_required, driver_selection) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (user_id, user_name, phone_no, car_model, car_cost, rental_start_date, rental_end_date, driver_required, driver_selection)
        )
        db.commit()
        flash('Car rental booking successful!')
    except mysql.connector.Error as err:
        flash(f"Error: {err}")
    finally:
        cursor.close()
    
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)

