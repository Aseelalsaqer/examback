'use strict'
const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const PORT=3400

const mongoose = require('mongoose');

main().catch(err => console.log(err));
let Fruit;
async function main() {
  await mongoose.connect('mongodb://localhost:27017/fruit');
  const fruitSchema = new mongoose.Schema({
    name: String,
    image: String,
    price:String,
    email:String
  });

 Fruit = mongoose.model('Fruit', fruitSchema);
// seedData();
}

let sample;
async function seedData(){
    sample = new Fruit({ 
        name: 'Silence'
     });
     await sample.save();
} 
// http://localhost:3400/fruitdata
server.get("/fruitdata",fruitData)
// http://localhost:3400/addfav
server.post("/addfav",addFav)
// http://localhost:3400/favdata/?email=${email}
server.get("/favdata",favData)
// http://localhost:3400/updatedata/${:id}
server.put("/updatedata/:id",updateData)
// http://localhost:3400/deletedata/${:id}?email=${email}
server.delete("/deletedata/:id", deleteDate)



function fruitData(req,res){
    let dataArray;
    axios
    .get(`https://fruit-api-301.herokuapp.com/getFruit`)
    .then((result)=>{
        dataArray=result.data.fruits.map((item)=>{
            return item
        })
        res.send(dataArray)
    })
    .catch((err)=>{
        console.log(err);
    });
};
async function addFav(req,res){
    

    const {name,image,price,email}= req.body
    await Fruit.create({
        email:email,
        name:name,
        image:image,
        price:price
    })
    Fruit.find({email:email},(err,result)=>{
        if(err)
        {console.log(err);}
        else{res.send(result);

        }
    })
}
function favData(req,res){
    const email =req.query.email

    Fruit.find({email:email},(err,result)=>{
        if(err)
        {console.log(err);}
        else{res.send(result);

        }
    
})
}
function updateData(req,res){
    const id= req.params.id
    const{name,image,price,email} = req.body

    Fruit.findByIdAndUpdate(id,{name,image,price},(err,result)=>{
         Fruit.find({email:email},(err,result)=>{
        if(err)
        {console.log(err);}
        else{res.send(result);

        }
    
})
    })
}

function deleteDate(req,res){
    const id= req.params.id
    const email =req.query.email

    Fruit.deleteOne({_id:id},(err,result)=>{
        Fruit.find({email:email},(err,result)=>{
            if(err)
            {console.log(err);}
            else{res.send(result);
    
            }
        
    })
    })
}

server.listen(PORT,()=>{
    console.log(`I am on ${PORT}`);
})
