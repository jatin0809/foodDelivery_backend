const express = require('express');
const fs = require('fs');
const router = express.Router();



router.get('/', (req, res) => {

  fs.readFile("./data/images.json", 'utf-8', (err, data) => {
      if (err) {
          console.error('Error in reading file:', err);
          return res.status(500).json({ message: 'Failed to fetch data' });
      }
      try {
          const jsonData = JSON.parse(data); // Parse JSON data
          res.status(200).json(jsonData);   // Send the parsed data as response
      } catch (parseError) {
          console.error('Error parsing JSON file:', parseError);
          res.status(500).json({ message: 'Invalid JSON format' });
      }
  });
});

  module.exports = router;