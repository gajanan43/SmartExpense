```markdown
# 💸 SmartExpense – Full Stack Expense Tracker

SmartExpense is a secure full-stack expense management web application built using **Spring Boot, MySQL, JWT Authentication, HTML, CSS, and JavaScript**.

Users must log in before accessing the system. The application uses **stateless JWT authentication** and connects to a MySQL database.

---

## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 🛡 Secure REST APIs (Spring Security)
- ➕ Add Expense
- 📊 View Total Expenses
- 📜 View Expense History
- ❌ Delete Expense
- 🌐 Fully Connected Frontend (Vanilla JS)
- 🗄 MySQL Database (Local / Cloud Supported)
- 🔄 Stateless Authentication (No Sessions)

---

## 🛠 Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT (io.jsonwebtoken)
- Spring Data JPA
- Hibernate
- MySQL

### Frontend
- HTML5
- CSS3
- JavaScript (Fetch API)

### Database
- MySQL (Local or Aiven Cloud)

---

## 🔐 Authentication Flow

1. User logs in with username & password.
2. Backend validates credentials.
3. JWT token is generated.
4. Token is stored in browser localStorage.
5. All API calls send:

```

Authorization: Bearer <TOKEN>

```

6. Backend validates token using JwtFilter.

---

## 📂 Project Structure

```

SmartExpense/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── dao/
│   ├── config/
│   └── model/
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
└── README.md

```

---

## ⚙ Backend Setup

### 1️⃣ Clone Project

```

git clone [https://github.com/yourusername/SmartExpense.git](https://github.com/yourusername/SmartExpense.git)

```

### 2️⃣ Configure Database (application.properties)

For Local MySQL:

```

spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=yourpassword

```

For Aiven Cloud MySQL:

```

spring.datasource.url=jdbc:mysql://HOST:PORT/defaultdb?ssl-mode=REQUIRED
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD

```

### 3️⃣ Run Backend

```

mvn spring-boot:run

```

Backend runs at:

```

[http://localhost:8080](http://localhost:8080)

```

---

## 🌐 Frontend Setup

1. Open frontend folder
2. Open `index.html`
3. Run using Live Server (VS Code)

Frontend runs at:

```

[http://127.0.0.1:5500](http://127.0.0.1:5500)

```

---

## 🔄 API Endpoints

| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | /register             | Register user      |
| POST   | /login                | Login user         |
| GET    | /api/expenses         | Get all expenses   |
| POST   | /api/expenses         | Add expense        |
| DELETE | /api/expenses/{id}    | Delete expense     |

---

## 🛡 Security Configuration

- Stateless session
- JWT filter before authentication
- CORS enabled for frontend
- Password encrypted using BCrypt

---

## 🧠 Future Improvements

- Link expenses to specific logged-in user
- Add refresh token system
- Role-based access control
- Deploy full stack (Render + Netlify)
- Add charts (Chart.js)

---

## 📸 Screenshots

(Add screenshots here once uploaded to GitHub)

---

## 👨‍💻 Author

**Gajanan Narwade**  
Java Backend Developer  
Spring Boot | MySQL | REST APIs | JWT  

---

## ⭐ If You Like This Project

Give it a star on GitHub ⭐
```


