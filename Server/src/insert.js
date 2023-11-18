const connection = require('./connection')

async function insert(input, colName) {
  let db = await connection()
  const col = db.collection(colName);


  // Insert the document into the specified collection        
  const p = await col.insertOne(input);
  return p
}

module.exports = insert
