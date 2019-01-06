// Server
const app = require('./app');

// Either use port provided via env or use default
const port = process.env.PORT || 3001;

// Start server
app.listen(port, () => console.log(`Backend app listening on port ${port}!`));