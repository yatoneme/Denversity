const { getFirestore } = require('firebase-admin/firestore')
const express = require('express')
const Categories = express.Router()

Categories.get('/', (req, res) => {
    const db = getFirestore()
    const categories = db.collection('categories')

    categories.get().then(data => {
        const allCategories = []

        data.forEach(doc => allCategories.push(doc.data()))
        res.status(200).send({ data: allCategories })
    }).catch(e => {
        console.error(e)
        res.sendStatus(500)
    })
})

module.exports = Categories;
