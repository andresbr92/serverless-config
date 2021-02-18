"use strict"
const uuid = require('uuid')
const aws = require("aws-sdk")
const dynamoDb = new aws.DynamoDB.DocumentClient({
  region: "eu-central-1",
})
module.exports.getElement = (event, context, callback) => {
  const params = {
    TableName: 'example-signeblock',
  }
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Some error occurred, please take a cup of cofee and test the code again, and again...",
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
    callback(null, response)
  })
}
module.exports.createElement = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  if (typeof data.text !== 'string') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Some error occurred, please take a cup of cofee and test the code again, and again...',
    })
    return
  }

  const params = {
    TableName: 'example-signeblock',
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Some error occurred, please take a cup of cofee and test the code again, and again...',
      })
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }
    callback(null, response)
  })


}
