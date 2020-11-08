'use strict';
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    deleteUser: async function (db, email) {
        try {
            let checkUser = await db.prepare("SELECT * FROM users WHERE email = @email");
            let res = await checkUser.get({"@email": email});
            await checkUser.finalize();
            if (res) {
                let deleteStmt = await db.prepare("DELETE FROM users WHERE email = @email");
                let res = await deleteStmt.run({"@email": email});
                await deleteStmt.finalize();
                if (!res.lastID) {
                    return false;
                }
                return true;
            }
            return true
        } catch (err) {
            throw new Error(err);
        }
    }
}