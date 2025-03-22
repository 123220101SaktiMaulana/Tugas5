import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Note = db.define(
    "notes",
    {
        judul: DataTypes.STRING,
        konten: DataTypes.STRING,
    },
    {
        freezeTableName: true,
    }
);

export default Note;

(async () => {
    try {
        await db.sync();
        console.log("Database synced successfully!");
    } catch (error) {
        console.error("Failed to sync database:", error);
    }
})();
