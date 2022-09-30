const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { title } = require("process");
const axios = require("axios").default;
const methodOverride = require('method-override')

class Active{
    constructor(options){
        this.main=options.main||""
        this.user=options.users||""
        this.jobs=options.jobs||""
        this.gallery=options.gallery||""
        this.contacts=options.contacts||""
    }
}

app.use(express.urlencoded({extended:false}))
app.use(methodOverride("_method"));


dotenv.config();
const createViewPath = (page) =>
    path.resolve(__dirname, "views", `${page}.ejs`);

const PORT = process.env.PORT;
// asosdksodk
app.set("view engine", "ejs");

app.listen(PORT, () => {
    console.log(
        `Server ${PORT}-portida  ishga tushdi ✅ http://localhost:${PORT}`
    );
});

const myLogger = function (req, res, next) {
    console.log("LOGGED");
    next();
};

app.use(myLogger);
app.use(express.static("styles"));
app.use(express.static("img"));
app.use(morgan(":method :url :status :res[content-length]-:response-time ms"));

app.get("/", (req, res) => {
    // res.send("<h1>Hello Express!</h1>");
    res.render(createViewPath("index"), { title: "Express Server" ,active: new Active({main:"active"})});
});
app.get("/main", (req, res) => {
    res.render(createViewPath("index"), { title: "Express Server",active: new Active({main:"active"}) });
});

app.get("/users", async(req, res) => {
    // const users = [
    //     { username: "Islom ", age: 22 },
    //     { username: "Azamat", age: 11 },
    //     { username: "Alijon", age: 18 },
    //     { username: "Shoxruh", age: 21 },
    // ];

    // try{
    //     const userData = await fetch("https://jsonplaceholder.typicode.com/users");
    //     const users = await userData.json();
    //     console.log(users);
    //     res.render(createViewPath("users"),{
    //         title:"Foydalanuvchilar",
    //         users,
    //         active: new Active({users:"active"})
    //     })
    // }
    // catch(error){
    //     console.error(error);
    // }

    try{
        const users = await(
            await axios.get(`https://jsonplaceholder.typicode.com/users`)
        ).data
        res.render(createViewPath("users"), {title:"Foydalanuvchilar", users, active: new Active({users:"active"})});
        
    }catch(error){
        console.error(error);
   }





    // res.render(createViewPath("users"), { title: "USERS", users ,active: new Active({users:"active"})});
});

app.get("/gallery", (req, res) => {

    res.render(createViewPath("gallery"), { title: "Gaallery", active: new Active({gallery:"active"})});
});
app.get("/contacts", (req, res) => {
    const contacts = [
        { name: "GitHub", url: "https://github.com/IsmoiloF" },
        { name: "Telegram", url: "https://ISMOILOFF_SH.t.me" },
        { name: "Instagram", url: "https://instagram.com/__shokh_ruh__" },
    ];
    res.render(createViewPath("contacts"), { title: "Contacts", contacts, active: new Active({contacts:"active"}) });
});
app.get("/jobs", (req, res) => {
    res.render(createViewPath("jobs"), { title: "NodeJS Jobs", active: new Active({jobs:"active"}) });
});




app.get("/user/:id", async (req, res) => {
    try {
      const userData = await axios({
        method:"GET",
        url:`https://jsonplaceholder.typicode.com/users/${req.params.id}`
      });
      const user = userData.data;
      res.render(createViewPath("user"), {
        title: user.username,
        active: new Active({ users: "active" }),
        user,
      });
    } catch (error) {
      console.log(error);
    }
});


app.get("/add-user", (req, res)=>{
    res.render(createViewPath("add-user"), {title:"New use", active: new Active({ users: "active" })})
})


app.post("/add-user", async(req, res)=>{
    const {username, email, name, phone} = req.body;
    try{
        const userData=await(
            await axios.post("https://jsonplaceholder.typicode.com/users", {username, email, name, phone})
        );
        const user = userData.data;
        res.render(createViewPath("user"), 
        {title:"foydalanuvchilar", user, active: new Active({ users: "active" })})
    }catch(error){
          console.error(error);
    }
})


app.delete("/user/:id", async(req, res)=>{
    const {id} = req.params;
    try{
        const userData = await axios.delete(
            `https://jsonplaceholder.typicode.com/users/${id}`
        );
        const user = userData.data;
        console.log(user);
        res.sendStatus(204);
    }catch(error){
        console.error(error);
    }
})


app.put("/edit/:id", async(req, res)=>{
    const {name, username, email, phone} = req.body;
    const {id} = req.params
    try{
        const userData=await(
            await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, {username, email, name, phone})
        );
        const user = userData.data;
        res.render(createViewPath("user"), 
        {title:"foydalanuvchilar", user, active: new Active({ users: "active" })})
    }catch(error){
          console.error(error);
    }
})



app.get("/edit/:id", async(req, res)=>{
    try{
        const userData = await axios({
            method:"GET",
            url:`https://jsonplaceholder.typicode.com/users/${req.params.id}`,
        });
        const user = userData.data;
        res.render(createViewPath("edit-user"),{
            title:user.username,
            user,
            active: new Active({ users: "active" })

        })
    }catch(error){
        console.log();
    }
})






app.use((req, res) => {
    res.status(404).render(createViewPath("error"));
});