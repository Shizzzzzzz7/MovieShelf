const express= require("express");
const mongoose= require("mongoose");
const bodyParser= require("body-parser");

const app= express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/movieDB")
.then(()=>{console.log("Connected");})
.catch((err)=>{
    console.log(err);
});

const movieSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    director:{
        type: String,
        required: true
    },
    budget: Number,
    stars: Number
});

const Movie= new mongoose.model("movie", movieSchema);

app.get("/",(req,res)=>{

    res.send("Hello");
});

app.get("/movies", async(req,res)=>{
    try{

        const movies=await Movie.find();
        res.status(200).send(movies);

    }catch(err){

        res.status(500).send("Error Occured");
        console.log(err);

    }
});


app.post("/movies", async(req,res)=>{
    try{
        // console.log(req.body);
        const movie= new Movie(req.body);
        const result= await movie.save();
        res.status(200).send("Succesfully Uploaded");

    }catch(err){

        res.status(500).send("Error Occured");
        console.log(err);

    }

});


app.patch("/movies/:id", async(req,res)=>{
//***********************************Notes************************************
    /* for url=> /movies/:id, 
    req.params returns an object=> { id: "The id which user have entered in the url" } */

    /* We cannot use Movie.findOneAndUpdate(req.params, req.body); bcoz in the condition section 
    id variable is named as "_id" but req.params returns variable name as "id" */
//****************************************************************************** 

   try{
    const updatedMovie= await Movie.findOneAndUpdate({_id:req.params.id}, req.body);
    res.status(200).send("Successfully Updated");

   }catch(err){

        res.status(500).send("Error Occured");
        console.log(err);

   } 
});

app.delete("/movies/:id", async(req,res)=>{

   try{

    await Movie.findOneAndDelete({_id:req.params.id});
    res.status(200).send("Successfully Deleted");

   }catch(err){

        res.status(500).send("Error Occured");
        console.log(err);

   } 
});


app.listen(3000, ()=>{

    console.log("Successfully on port 3000");
});