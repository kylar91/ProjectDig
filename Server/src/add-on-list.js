const { ObjectId } = require("mongodb")
const connection = require('./connection')
const select = require('./select-data')

async function addOnList(animeId, userId, nameList) {
    const anime = await select(animeId)

    let db = await connection()
    let col = db.collection("List")

    const checkList = await col.findOne({ "_id": new ObjectId(userId) })

    if (checkList) {
        // Se l'anime è presente in un'altra lista, lo rimuovo da quella lista
        const removeFromOtherLists = ['in_corso', 'completati', 'droppati'].filter(list => list !== nameList)
        const updateFields = removeFromOtherLists.reduce((fields, list) => {
            fields[list] = { _id: new ObjectId(animeId) }
            return fields
        }, {})

        await col.updateOne({ _id: new ObjectId(userId) }, { $pull: updateFields })

        const isAlreadyInList = checkList[nameList].some(item => item._id.toString() === animeId)

        // Se non è già presente, aggiungo l'anime alla lista
        if (!isAlreadyInList) {
            const updateField = {}
            updateField[`${nameList}`] = anime
            const updateResult = await col.updateOne({ _id: new ObjectId(userId) }, { $push: updateField })
        }

    } else {
        let newList = {
            _id: new ObjectId(userId),
            in_corso: [],
            completati: [],
            droppati: []
        }

        newList[`${nameList}`].push(anime)

        const result = await col.insertOne(newList)

        return result
    }
}

module.exports = addOnList