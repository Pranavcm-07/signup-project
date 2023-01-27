const express = require('express')
const bodyparser= require('body-parser')
const request = require('request')
const https = require('https')
const port = process.env.PORT
const app = express()
require('dotenv').config({path: __dirname+'/.env'})
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html')
})
app.post('/',function(req,res){
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const Apikey = process.env.apikey
    const Listid = process.env.listid
    const Apiserver = process.env.apiserver

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    }
    const jsondata = JSON.stringify(data)
    const url = 'https://'+Apiserver+'.api.mailchimp.com/3.0/lists/'+Listid

    const options = {
        method: 'POST',
        auth: 'pranav:'+Apikey
    }

    const request = https.request(url,options ,function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname+'/success.html')
        }else{
            res.sendFile(__dirname+'/failure.html')
        }

        response.on('data',function(data){
           console.log(JSON.parse(data)) 
        })
    })

    request.write(jsondata)
    request.end()
})

app.post('/failure',function(req,res){
    res.redirect('/')
})

app.listen(port,function(){
    console.log('server is running on port ${port}')
})
