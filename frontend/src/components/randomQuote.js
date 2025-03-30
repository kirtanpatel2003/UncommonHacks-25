// CHANGED (new file) -> QuoteOfTheDay.jsx

import { useState, useEffect } from "react"

export default function QuoteOfTheDay() {
  // CHANGED: local state for quote of the day
  const [quoteBody, setQuoteBody] = useState("")
  const [quoteAuthor, setQuoteAuthor] = useState("")
  const [qotdError, setQotdError] = useState(null)
  const [isLoadingQotd, setIsLoadingQotd] = useState(true)

  // CHANGED: fetch QOTD as soon as this component mounts
  useEffect(() => {
    fetchQuoteOfTheDay()
  }, [])

  // CHANGED: call FavQs’s "Quote of the Day" endpoint
  const fetchQuoteOfTheDay = async () => {
    setIsLoadingQotd(true)
    setQotdError(null)
    try {
      // Endpoint: https://favqs.com/api/qotd
      // Example response:
      // {
      //   "qotd_date": "2014-07-04T03:00:00.000-05:00",
      //   "quote": {
      //     "id": 17025,
      //     "author": "Abraham Lincoln",
      //     "body": "Fourscore and seven years ago ..."
      //   }
      // }
      //const response = await fetch("https://favqs.com/api/qotd") // CHANGED
      const response = await fetch(
        "https://api.allorigins.win/raw?url=https://favqs.com/api/qotd"
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch Quote of the Day")
      }
      const data = await response.json()
      setQuoteBody(data.quote.body)      // CHANGED
      setQuoteAuthor(data.quote.author)  // CHANGED
    } catch (err) {
      console.error("Error fetching QOTD:", err)
      setQotdError("Could not fetch the Quote of the Day.")
    } finally {
      setIsLoadingQotd(false)
    }
  }

  return (
    <div className="qotd-container">
      {isLoadingQotd && <p>Loading quote of the day...</p>}
      {qotdError && <p>{qotdError}</p>}
      {!isLoadingQotd && !qotdError && (
        <blockquote>
          <p>“{quoteBody}”</p>
          {/* <footer>— {quoteAuthor}</footer> */}
        </blockquote>
      )}
    </div>
  )
}
