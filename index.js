const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const pool = require('./configs/dbConfig')
const app = express()
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

// Handle coupon GET route for all coupons
app.get('/coupons/', (req, res) => {
  const query = 'SELECT * FROM coupons'
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }
    const coupons = [...results]
    const response = {
      data: coupons,
      message: 'All coupons successfully retrieved.',
    }
    res.send(response)
  })
})

// Handle coupon GET route for a specific coupon
app.get('/coupons/:couponId', (req, res) => {
  const couponId = req.params.couponId
  const query = `SELECT * FROM coupons WHERE couponId =${couponId}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const coupon = results[0]
    const response = {
      data: coupon,
      message: `Coupon ${coupon.couponCode} successfully retrieved.`,
    }
    res.status(200).send(response)
  })
})

// Handle coupons POST route
app.post('/coupons/', (req, res) => {
  const { couponCode, expireDate, discount,productId } = req.body
  const query = `INSERT INTO coupons (couponCode, expireDate, discount, productId) VALUES ('${couponCode}', '${expireDate}', '${discount}', '${productId}')`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { insertId } = results
    const coupon = { couponId: insertId, couponCode, expireDate, discount, productId }
    const response = {
      data: coupon,
      message: `Coupon ${couponCode} successfully added.`,
    }
    res.status(201).send(response)
  })
})




// Handle coupon PUT route
app.put('/coupons/:couponId', (req, res) => {
  const { couponId } = req.params
  const query = `SELECT * FROM coupons WHERE couponId=${couponId} LIMIT 1`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message, }
      res.send(response)
    }

    const { couponId, couponCode, expireDate, discount, productId } = { ...results[0], ...req.body }
   
    const query = `UPDATE coupons SET couponCode='${couponCode}', expireDate='${expireDate}', discount='${discount}', productId='${productId}' WHERE couponId='${couponId}'`
    pool.query(query, (err, results, fields) => {
      if (err) {
        const response = { data: null, message: err.message, }
        res.send(response)
      }
      else{
        const coupon = {
          couponId,
          couponCode,
          expireDate,
          discount,
          productId,
        }
        const response = {
          data: coupon,
          message: `Coupon ${couponCode} is successfully updated.`,
        }
        res.send(response)
      }

    })
  })
})

// Handler coupon DELETE route
app.delete('/coupons/:couponId', (req, res) => {
  const { couponId } = req.params;
  const query = `DELETE FROM coupons WHERE couponId=${couponId}`
  pool.query(query, (err, results, fields) => {
    if (err) {
      const response = { data: null, message: err.message }
      res.send(response)
    }

    const response = {
      data: null,
      message: `Coupon with id: ${couponId} successfully deleted.`,
    }
    res.send(response)
  })
})

// Handle in-valid route
app.all('*', function(req, res) {
  const response = { data: null, message: 'Route not found!!' }
  res.status(400).send(response)
})

// wrap express app instance with serverless http function
module.exports.handler = serverless(app)
