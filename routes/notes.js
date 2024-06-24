const router = require('express').Router();
const Note = require('../models/Note');
const verify = require('./verifyToken');

// Get all notes with optional search query
router.get('/', verify, async (req, res) => {
    const query = req.headers.query || '';
    const notes = await Note.find({
        userId: req.user._id,
        $or: [
            { title: new RegExp(query, 'i') },
            { content: new RegExp(query, 'i') },
            { tags: new RegExp(query, 'i') }
        ]
    });
    res.json(notes);
});

// Add a new note
router.post('/', verify, async (req, res) => {
    const note = new Note({
        userId: req.user._id,
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        category: req.body.category
    });

    try {
        const savedNote = await note.save();
        res.send(savedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Edit a note
router.put('/:noteId', verify, async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.noteId, userId: req.user._id },
            { content: req.body.content, tags: req.body.tags, category: req.body.category },
            { new: true }
        );
        res.send(updatedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a note
router.delete('/:noteId', verify, async (req, res) => {
    try {
        const removedNote = await Note.remove({ _id: req.params.noteId, userId: req.user._id });
        res.send(removedNote);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
