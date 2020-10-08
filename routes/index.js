const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  const me = {name: Abdelfatah, Age: 19 }
 //  res.send('Route');
  res.json(me)
});

module.exports = router;
