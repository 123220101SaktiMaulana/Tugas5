import { Sequelize } from "sequelize";
import mysql from 'mysql2'; 

const db = new Sequelize('catatan', 'root', '', {
    host: '34.173.153.163', 
    dialect: 'mysql',
    port: 3306,              
});

export default db;
