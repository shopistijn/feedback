const axios = require('axios');

const FIREBASE_URL = 'https://trustprofilereviews-default-rtdb.firebaseio.com/reviews';

function safeEmail(email) {
  return email.replace(/@/g, '_at_').replace(/\./g, '_dot_');
}

export default async function handler(req, res) {
  const {
    query: { email },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const safe_email = safeEmail(email);
    const response = await axios.get(`${FIREBASE_URL}/${safe_email}.json`);
    const data = response.data;

    if (!data) {
      return res.json({ data: [] });
    }

    const reviews = Object.values(data);

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  } 
}
