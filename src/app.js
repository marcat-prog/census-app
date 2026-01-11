const express = require('express');
const dotenv = require('dotenv');
const participantsRouter = require('./routes/participants');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();
app.use(express.json());

// All endpoints require admin authentication
app.use(auth);

app.use('/participants', participantsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
