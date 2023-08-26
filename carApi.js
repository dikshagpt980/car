let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});
//  const port = 2410;

var port = process.env.PORT || 2410;
 app.listen(port, ()=> console.log(`Node app listening on port ${port}!`));

 let {CarMaster,Cars} = require("./carData.js");

 filterfuel=(model,name,types)=>{
    let str = CarMaster.find((ele)=> ele.model===model);
    if(str){
        if(types === "fuel"){
            if(str.fuel === name){
                return true;
            }
            else {
                return false;
            }
        }
        else if(types === "type"){
            if(str.type === name){
                return true;
            }
            else {
                return false;
            }
        }
        
    }
    else{
        return false;
    }
 }
 
 app.get("/svr/cars", function(req,res){
    let maxprice = req.query.maxprice;
    let minprice = req.query.minprice;
    let fuel = req.query.fuel;
    let type = req.query.type;
    let sort = req.query.sort;
    let arr = Cars;
    console.log(req.query);
    if(maxprice){
        arr= arr.filter((s1)=> s1.price <= +maxprice);
    }
    if(minprice){
        arr= arr.filter((s1)=> s1.price >= +minprice);
    }
    if(fuel){
        arr = arr.filter((s1)=> filterfuel(s1.model,fuel,"fuel"))
    }
    if(type){
        arr = arr.filter((s1)=> filterfuel(s1.model,type,"type"))
    }

    if(sort === "kms"){
        arr= arr.sort((s1,s2)=>s1.kms-s2.kms);
    }
    if(sort === "year"){
        arr= arr.sort((s1,s2)=> s1.year-s2.year);
    }
    if(sort === "price"){
        arr= arr.sort((s1,s2)=>s1.price-s2.price);
    }
    res.send(arr);
 });

 app.get("/svr/cars/masterArr" , function(req,res){
    res.send(CarMaster);
 });

 app.get(`/svr/cars/:id`,function(req,res){
    let id = req.params.id;
    let car = Cars.find((ele)=> ele.id === id);
    if(car){
        res.send(car)
    }
    else{
        res.status(404).send("No car found");
    }
 })

 app.post(`/svr/car`,function(req,res){
    let body = {...req.body};
    let newCar = {...body};
    Cars.push(newCar);
    res.send(newCar);
 })

 app.put("/svr/car/:id", function(req, res){
    let id = req.params.id;
    let body = req.body;
    let index = Cars.findIndex((s1) => s1.id=== id);
    if(index>=0){
        let updateCar = {...body}
        Cars[index] = updateCar;
        res.send(updateCar);
    }
    else{
        res.status(404).send("No car found");
    }
});

app.delete("/svr/car/:id", function(req, res){
    let id = req.params.id;
    let index = Cars.findIndex((s1) => s1.id === id);
    if(index>=0){
        let deleteCar = Cars.splice(index,1);
        res.send(deleteCar);
    }
});
