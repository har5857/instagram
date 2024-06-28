const express = require('express');
const router = express.Router();

const userRoutes = require('./features/auth/route/user.route');

//user routes
router.use('/user', userRoutes);

module.exports = router;
