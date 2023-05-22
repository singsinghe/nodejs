
const express = require('express')
const ejs = require('ejs') 
const app = express()
const port = 3000
var bodyParser = require('body-parser')

require('dotenv').config()



const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

app.set('view engine','ejs') 
app.set('views','./views')
 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname+'/public')) 
 
app.get('/', (req, res) => {
   res.render('index')   // ./views/index.ejs  
})

app.get('/profile', (req, res) => {
   res.render('profile')  
})

app.get('/map', (req, res) => {
   res.render('map')  
})

app.get('/contact', (req, res) => {
   res.render('contact')  
})


app.post('/contactProc', (req, res) => {
   const name = req.body.name; 
   const phone = req.body.phone; 
   const email = req.body.email; 
   const memo = req.body.memo; 
 
   var sql = `insert into contact(name,phone,email,memo,regdate)
   values('${name}','${phone}','${email}','${memo}',now() )`
   
   connection.query(sql, function (err, result){
       if(err) throw err; 
       console.log('자료 1개를 삽입하였습니다.');
       res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/';</script>"); 
   })

})


app.get('/contactDelete', (req, res) => {
   var idx = req.query.idx 
   var sql = `delete from contact where idx='${idx}' `
   connection.query(sql, function (err, result){
      if(err) throw err; 
      
      res.send("<script> alert('삭제되었습니다.'); location.href='/contactList';</script>"); 
  })
})


app.get('/contactList', (req, res) => {

   var sql = `select * from contact order by idx desc `
   connection.query(sql, function (err, results, fields){
      if(err) throw err; 
      res.render('contactList',{lists:results})
   })
   
})


 

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})