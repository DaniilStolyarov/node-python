const express = require('express')
const formidable = require('express-formidable')
const fs = require('fs')
const {PythonShell} = require('python-shell');

var http = require('http');
http.globalAgent.maxSockets = 20;

const app = express()

app.use(express.static('./static'))

console.log(process.argv[2])

const windows_path = {python : ".\\py-script\\venv\\Scripts\\python.exe", script : ".\\py-script\\"}
const linux_path = {python : "./py-script/venv/bin/python" , script : "./py-script"}

let pyShell = new PythonShell('main.py', {pythonPath : linux_path.python, scriptPath : linux_path.script})


app.post('/upload/image', formidable(), async (req, res) =>
{
    const string = req.fields.image
    var data = string.substr(string.indexOf('base64') + 7)
    var buffer = Buffer.from(data, 'base64');
    fs.writeFileSync('./py-script/image.png', buffer);
    const promiseMessage = new Promise(function(resolve, reject) 
    {
        pyShell.send('predict image')
        pyShell.once('message', function(message) 
        {
            resolve(message)
        })
        setTimeout(() => {
            reject('timeout')
        }, 5000);
    })
    const msg = await promiseMessage;
    if (Number(msg) != NaN)
    {
        res.json(JSON.stringify({answer : Number(msg)}))
    }
    else console.log(msg)
    res.end()
})
app.listen(80, (err) =>
{
    if (err) console.log(err);
})

