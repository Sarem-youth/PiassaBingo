const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/game.routes')(app);
require('./routes/credit.routes')(app);
require('./routes/cartela.routes')(app);
require('./routes/cartelaGroup.routes')(app);
require('./routes/dashboard.routes')(app);

db.sequelize.sync();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
