const express = require('express')
const bodyparser= require('body-parser')
const request = require('request')
const https = require('https')
const app = express()
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html')
})
app.post('/',function(req,res){
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname

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
    const url = 'https://us21.api.mailchimp.com/3.0/lists/ffbeb0908b'

    const options = {
        method: 'POST',
        auth: 'pranav:501a9222c2590d2c97c4253ddb9081f1-us21'
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

app.listen(3000,function(){
    console.log('server is running on port 3000')
})

//  501a9222c2590d2c97c4253ddb9081f1-us21
// ffbeb0908b