import Note from "../models/NoteModel.js";


export const getNotes = async (req, res) => {
    try {
        const response = await Note.findAll({
            where: { userId: req.userId }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const getNotesbyId = async (req, res) => {
    try {
        const response = await Note.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });
        if (!response) return res.status(404).json({ msg: "Note tidak ditemukan atau bukan milik Anda" });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};


export const createNotes = async (req, res) => {
    try {
        await Note.create({
            ...req.body,
            userId: req.userId
        });
        res.status(201).json({ msg: "Note Created" });
    } catch (error) {
        console.log(error.message);
    }
};


export const updateNotes = async (req, res) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id } });
        if (!note || note.userId !== req.userId)
            return res.status(403).json({ msg: "Akses ditolak" });

        await Note.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "Note Updated" });
    } catch (error) {
        console.log(error.message);
    }
};


export const deleteNotes = async (req, res) => {
    try {
        const note = await Note.findOne({ where: { id: req.params.id } });
        if (!note || note.userId !== req.userId)
            return res.status(403).json({ msg: "Akses ditolak" });

        await Note.destroy({
            where: { id: req.params.id }
        });
        res.status(200).json({ msg: "Note Deleted" });
    } catch (error) {
        console.log(error.message);
    }
};

