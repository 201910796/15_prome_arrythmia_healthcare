const app = require('./app');
const config = require('./src/config/config');

app.listen(config.port, '0.0.0.0', () => {
    console.log(`http://localhost:${config.port}`);
});