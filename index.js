const express=require("express")
const mongoose= require("mongoose")
const cors = require('cors')
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")

const {userRouter}=require("./routes/user.route")
const {notesRoutes}=require("./routes/note.route")
const {auth}=require("./middleware/auth.middleware")

require("dotenv").config()
const app=express()
app.use(express.json())
app.use(cors())

app.use("/users",userRouter)
//app.use(auth)
app.use("/notes",notesRoutes)

//definition
const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Full Stack App",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:4500"
            }
        ]
    },
    apis:["./routes/*.js"]
}

//specification
const swaggerSpac=swaggerJSdoc(options)

//building the UI
app.use("/documentations",swaggerUi.serve,swaggerUi.setup(swaggerSpac))

app.listen(process.env.port,async()=>{
    try {
        await mongoose.connect(process.env.mongoURL)
    console.log("Connected to db")
    console.log(`Server is running at port ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
    
})