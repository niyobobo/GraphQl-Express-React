const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.json({
  message: 'Welcome here'
}));

app.listen(PORT, () => console.log(`App runs on port ${PORT}`));