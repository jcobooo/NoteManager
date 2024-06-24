const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken');

// Get user profile
router.get('/profile', verify, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.send(user);
});

// Update user profile
router.put('/profile', verify, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        user.username = username || user.username;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
