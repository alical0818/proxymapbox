const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


app.get('/events', async (req, res) => {
  const orgId = req.query.org_id;
  if (!orgId) {
    return res.status(400).json({ error: 'Missing org_id' });
  }

  try {
    const apiUrl = `https://api.mobilize.us/v1/organizations/${orgId}/events`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data); // send raw JSON to frontend
  } catch (err) {
    console.error('Error fetching Mobilize data:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
