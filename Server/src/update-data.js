
const connection = require('./connection')

async function run() {
  let db = await connection()
  const col = db.collection("people");

  // Update the document into the specified collection        
  const updateResult = await col.updateOne({ "name.last": "Turing" }, { $set: { dead: true } });
  console.log('Updated documents =>', updateResult);

}

run().catch(console.dir);