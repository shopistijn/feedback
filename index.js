const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Replace with your Firebase Realtime Database URL
const FIREBASE_URL = 'https://trustprofilereviews-default-rtdb.firebaseio.com/reviews';

function safeEmail(email) {
  return email.replace(/@/g, '_at_').replace(/\./g, '_dot_');
}

app.get('/reviews/:email', async (req, res) => {
  const email = req.params.email;
  const safe_email = safeEmail(email);

  try {
    const response = await axios.get(`${FIREBASE_URL}/${safe_email}.json`);
    const data = response.data;

    if (!data) {
      return res.json({ data: [] });
    }

    const reviews = Object.values(data);

    res.json({
      data: reviews
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});