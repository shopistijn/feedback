const axios = require('axios');

const FIREBASE_URL = 'https://trustprofilereviews-default-rtdb.firebaseio.com/reviews';

function safeEmail(email) {
  return email.replace(/@/g, '_at_').replace(/\./g, '_dot_');
}

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const safe_email = safeEmail(email);

  try {
    const response = await axios.get(`${FIREBASE_URL}/${safe_email}.json`);
    const data = response.data;

    if (!data) {
      return res.json({ data: [] });
    }

    const reviews = Object.values(data);

    return res.status(200).json({ data: reviews });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}
