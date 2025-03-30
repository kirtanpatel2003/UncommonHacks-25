require('dotenv').config(); // Load env variables at the top
console.log("Auth0 Secret:", process.env.AUTH0_SECRET);

const express = require('express');
const session = require('express-session');
const { auth } = require('express-openid-connect');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 2000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS configuration (adjust origin as needed)
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_Secret_key", // Use an environment variable for better security
    resave: false,
    saveUninitialized: true,
  })
);

// Auth0 configuration using express-openid-connect
const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || "your_Secret_key",
  baseURL: `http://localhost:${PORT}`,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

app.use(auth(authConfig));

// Public route
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect('http://localhost:3000/success');
  }
  res.send('<a href="/login">Login</a>');
});

// Updated success route - stores user data in MongoDB and displays a success message
app.get('/success', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  
  const authUser = req.oidc.user;
  
  try {
    let user = await User.findOne({ email: authUser.email });
    
    if (!user) {
      user = await User.create({
        name: authUser.name,
        email: authUser.email,
        picture: authUser.picture,
      });
      console.log("New user created:", user);
    } else {
      console.log("User already exists:", user);
    }
    
    res.send('<h1>Successfully logged in!</h1>');
  } catch (err) {
    console.error("Error accessing the database:", err);
    res.status(500).send("Internal server error");
  }
});

// Protected route - returns user info as JSON
app.get('/profile', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).send("Not logged in");
  }
  
  const authUser = req.oidc.user;
  try {
    let user = await User.findOne({ email: authUser.email });
    if (!user) {
      user = await User.create({
        name: authUser.name,
        email: authUser.email,
      });
      console.log("New user created:", user);
    }
    res.json({ message: "Successfully logged in", user });
  } catch (err) {
    console.error("Error accessing the database:", err);
    res.status(500).send("Internal server error");
  }
});

// Logout route to clear session
app.get('/logout', (req, res) => {
  req.oidc.logout({ returnTo: 'http://localhost:3000' });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
