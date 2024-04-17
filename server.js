const app = require("./app.js");
const {connectdatabase} = require("./config/database.js");

connectdatabase();
app.listen(process.env.PORT,()=>{
    console.log(`app is listening to port ${process.env.PORT} in mode ${process.env.NODE_ENV}`);
})

app.get("/",(req,res)=>{
    res.send("working");
})