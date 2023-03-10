const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "^5xmOT9h",
  connectionLimit: 5,
  database: "Project",
});

async function query(sqlQuery) {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query(sqlQuery);
    return res;
    // rows: [ {val: 1}, meta: ... ]
    // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

module.exports = query;
