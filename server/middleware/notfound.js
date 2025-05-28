// server/middleware/notFound.js
// This middleware handles requests to routes that don't exist.
const notFound = (req, res) => res.status(404).send('Route does not exist');

module.exports = notFound;