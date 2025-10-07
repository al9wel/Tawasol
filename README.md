# 🌐 Tawasol Social Media Website

Tawasol is a simple and interactive **social media web application** built using **HTML, CSS, and JavaScript** with the **Tarmeez Academy API** as the backend service.  
The app allows users to create accounts, log in, post content, view others’ posts, and interact with a dynamic feed — all through live API integration.

---

![App Preview](https://i.imgur.com/SDLKncG.png)
![Profile Page](https://i.imgur.com/D5lgA9I.png)
![Comments](https://i.imgur.com/sBPQlId.png)

---

## 📍Live Demo

- https://al9wel-6.netlify.app/

---

## 🚀 Features

- 👤 **User Authentication** – Register, log in, and log out using the Tarmeez Academy API.
- 📝 **Post Creation** – Users can create and publish new posts instantly.
- 📰 **Dynamic Feed** – Fetches and displays posts from all users in real time.
- 💬 **Post Details & Comments** – View post details and read/write comments.
- 📸 **Image Upload Support** – Posts can include images using the API.
- 💻 **Responsive UI** – Works perfectly on desktop, tablet, and mobile devices.
- ⚡ **API-Based System** – Fully powered by live API requests for a realistic experience.

---

## 🧠 Purpose

This project was built to practice working with **REST APIs**, **asynchronous JavaScript**, and **JSON data handling**.  
It also demonstrates the basics of **authentication**, **CRUD operations**, and **front-end integration with external APIs**.

---

## 🏗️ Technologies Used

- **HTML5** – Layout and structure.
- **CSS3** – Styling and responsive design.
- **JavaScript (ES6)** – Logic, DOM updates, and API communication.
- **Tarmeez Academy API** – Provides all data for users, posts, and authentication.

---

## 🧾 How to Use

1. **Clone or Download the Project**

   ```bash
   git clone https://github.com/al9wel/Tawasol.git
   ```

2. **Open the Folder**
   ```bash
   cd Tawasol
   ```
3. **Install The Libraryes**
   ```bash
   npm install
   ```
4. **Run the App**

   - Simply open `index.html` in your browser.
   - No backend setup required — all data is fetched directly from the **Tarmeez Academy API**.

5. **Create an Account**

   - Go to the **Login/Register** page.
   - Sign up with your name, username, and password.

6. **Explore the Feed**

   - View posts from other users in real time.
   - Click on any post to see its details and comments.

7. **Create a New Post**

   - Click the “New Post” button.
   - Add a title, body, and optional image.
   - Submit — and your post appears instantly in the feed!

8. **Log Out Anytime**
   - Click on your profile to safely log out and clear your session.

---

## 🔗 API Reference

All data and requests are handled through the  
**[Tarmeez Academy API](https://www.postman.com/material-physicist-56285118/trameez-final-project/collection/s1f1tvb/tarmeez)**

**Example Endpoints:**

| Function          | Method | Endpoint               |
| ----------------- | ------ | ---------------------- |
| Get all posts     | GET    | `/posts`               |
| Get single post   | GET    | `/posts/{id}`          |
| Create new post   | POST   | `/posts`               |
| Register new user | POST   | `/register`            |
| Log in user       | POST   | `/login`               |
| Add comment       | POST   | `/posts/{id}/comments` |

---

## 📈 Future Improvements

- ❤️ Add “Like” functionality for posts.
- 👥 Add user profiles with followers/following lists.
- 📷 Support for multiple images per post.
- 🔒 Enhanced security and token storage.
- 🌗 Add dark/light theme toggle.
- 📱 Mobile-first layout improvements.

---

## 👨‍💻 Author

**Salem Ahmed Saeed Alswil**  
💼 Front-End Developer | API Integration Projects  
📧 [sa.al9wel@gmail.com]  
🌐 [GitHub Profile](https://github.com/yourusername)  
📍 Yemen

---

## 📜 License

This project is open-source and available for educational or personal use.

---
