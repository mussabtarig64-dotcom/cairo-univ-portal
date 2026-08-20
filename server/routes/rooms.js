const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// جلب جميع الغرف
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find().populate('createdBy', 'name email');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;