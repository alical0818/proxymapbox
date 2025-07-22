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
  
   let apiUrl = `https://api.mobilize.us/v1/organizations/${orgId}/events`;
  let allEvents = [];

  try {
    while (apiUrl) {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data) {
        allEvents = allEvents.concat(data.data);
      }

      apiUrl = data.next || null; // next is null when there are no more pages
    }

    res.json(allEvents); // send all combined event data to frontend
  } catch (err) {
    console.error('Error fetching Mobilize data:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
