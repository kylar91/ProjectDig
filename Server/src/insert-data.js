const connection = require('./connection')

async function insert(input) {
    let db = await connection()
    const col = db.collection("people");

    // Create a new document                                                                                                                                           
    let personDocument = {
        "name": { "first": "Alan", "last": "Turing" },
        "birth": new Date(1912, 5, 23), // May 23, 1912                                                                                                                                 
        "death": new Date(1954, 5, 7),  // May 7, 1954                                                                                                                                  
        "contribs": ["Turing machine", "Turing test", "Turingery"],
        "views": 1250000
    }

    // Insert the document into the specified collection        
    const p = await col.insertOne(personDocument);

}

module.exports = insert
