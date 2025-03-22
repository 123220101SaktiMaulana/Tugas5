import express from "express";

import { 
    getNotes, 
    getNotesbyId,
    createNotes,
    updateNotes,
    deleteNotes
} from "../controllers/NoteController.js";

const router = express.Router();

router.get('/Notes',getNotes);
router.get('/Notes/:id',getNotesbyId);
router.post('/Notes',createNotes);
router.patch('/Notes/:id',updateNotes);
router.delete('/Notes/:id',deleteNotes);

export default router;