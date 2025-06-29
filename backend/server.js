const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require('./routes/auth.routes')(app);
require('./routes/cartela.routes')(app);
require('./routes/cartelaGroup.routes')(app);
require('./routes/credit.routes')(app);
require('./routes/dashboard.routes')(app);
require('./routes/game.routes')(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
