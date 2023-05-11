const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.FRONTEND_PORT || 666;

app.use(cors({
  origin: '*',
}));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { API_URL: process.env.API_URL });
});
app.get('/comparsion', (req, res) => {
  res.render('comparsion', { API_URL: process.env.API_URL });
});

app.listen(PORT, () => {
  console.log(`Frontend listening on port ${PORT}`);
});
