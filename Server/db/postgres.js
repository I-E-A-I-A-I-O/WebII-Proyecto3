const { Pool } = require('pg');
const pool = new Pool({
    user: 'gpsjvbvzqaprer',
    host: 'ec2-54-236-122-55.compute-1.amazonaws.com',
    database: 'd840r78s2qvm4h',
    password: '0570df85132344e5d4595cdb6cf9f2da7dde0e9b8e49e4509d9c21e1bb62a248',
    port: 5432,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
    queryAsync: (text, params) => {
        return pool.query(text, params);
    }
}