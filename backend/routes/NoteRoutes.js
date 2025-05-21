import express from "express";
import {
    getNotes,
    getNotesbyId,
    createNotes,
    updateNotes,
    deleteNotes
} from "../controllers/NoteController.js";
import { verifyToken } from "../middleware/VerivyToken.js";

const router = express.Router();

router.get('/notes', verifyToken, getNotes);
router.get('/notes/:id', verifyToken, getNotesbyId);
router.post('/notes', verifyToken, createNotes);
router.patch('/notes/:id', verifyToken, updateNotes);
router.delete('/notes/:id', verifyToken, deleteNotes);

export default router;
