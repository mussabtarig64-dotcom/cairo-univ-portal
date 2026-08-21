const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// جلب جميع الغرف
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find().populate('createdBy', 'name email');
        res.json(rooms);
    } catch (err) {
        console.error('Fetch Rooms Error:', err.message, err.stack);
        res.status(500).json({
            success: false,
            error: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

// إنشاء غرفة جديدة
router.post('/', async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;

        const room = new Room({
            name,
            description,
            createdBy
        });

        await room.save();
        res.status(201).json({ message: 'Room created successfully!', room });
    } catch (err) {
        console.error('Create Room Error:', err.message, err.stack);
        res.status(500).json({
            success: false,
            error: err.message,
            stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        });
    }
});

module.exports = router;