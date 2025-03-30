console.log("✅ auth.js routes loaded")
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// MongoDB Model
const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    password: String,
    arduinoId: String,
  }), 'allowedusers')

router.post('/login', async (req, res) => {
    const { email, password } = req.body
  
    // Log what was received
    console.log("Login Request Received:")
    console.log("Email from frontend:", email)
    console.log("Password from frontend:", password)
  
    try {
      const user = await User.findOne({ email, password })
  
      // Log what is found
      if (!user) {
        console.log("No matching user found.")
        return res.json({ success: false, message: 'Invalid credentials' })
      }
  
      console.log("User matched!")
      console.log("Matched email:", user.email)
      console.log("Matched arduinoId:", user.arduinoId)
  
      res.json({
        success: true,
        email: user.email,
        arduinoId: user.arduinoId,
      })
    } catch (err) {
      console.error("Server error during login:", err)
      res.status(500).json({ success: false, message: 'Server error' })
    }
  })

module.exports = router