const { ObjectId } = require("mongodb")
const getDB = require('./connection')
const select = require('./select-data')

async function addOnList(animeId, userId, nameList) {
    const anime = await select('Anime', animeId)

    let db = await getDB()
    let col = db.collection("List")

    const checkList = await col.findOne({ "_id": new ObjectId(userId) })

    if (checkList) {
        const removeFromOtherLists = ['in_corso', 'completati', 'droppati'].filter(list => list !== nameList)
        const updateFields = removeFromOtherLists.reduce((fields, list) => {
            fields[list] = { _id: new ObjectId(animeId) }
            return fields
        }, {})

        await col.updateOne({ _id: new ObjectId(userId) }, { $pull: updateFields })

        const isAlreadyInList = checkList[nameList].some(item => item._id.toString() === animeId)

        if (!isAlreadyInList) {
            const updateField = {}
            updateField[`${nameList}`] = anime
            const updateResult = await col.updateOne({ _id: new ObjectId(userId) }, { $push: updateField })
        }
        return

    } else {
        let newList = {
            _id: new ObjectId(userId),
            in_corso: [],
            completati: [],
            droppati: []
        }

        newList[`${nameList}`].push(anime)

        const result = await col.insertOne(newList)

        return
    }
}

module.exports = addOnList