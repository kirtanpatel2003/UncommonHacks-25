const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST'],
//   credentials: true
// }))

const allowedOrigins = [
  'http://localhost:3000',
  'https://www.weathergenie.us'
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}))

app.use(express.json())

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))

// Mount routes
const authRoutes = require('./routes/auth')
app.use('/api', authRoutes)

app.listen(process.env.PORT || 5012, () =>
  console.log('Server running on port', process.env.PORT || 5012)
)