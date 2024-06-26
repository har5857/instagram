const express = require('express');
const router = express.Router();

const userRoutes = require('./features/auth/route/user.route');

router.use('/user', userRoutes);

module.exports = router;
