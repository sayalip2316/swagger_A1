const express=require("express")
const notesRoutes=express.Router()
const {NoteModel}=require("../model/notes.model")
const jwt=require("jsonwebtoken")



/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID by MongoDB
 *         title:
 *           type: string
 *           description: Note's title
 *         body:
 *           type: string
 *           description: Information about title
 *         sub:
 *           type: string
 *           description: Subject of Note
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all Notes from the database
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of all Notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

notesRoutes.get("/",async(req,res)=>{
const token=req.headers.authorization.split(" ")[1]
const decoded=jwt.verify(token,"masai")
try {
    if(decoded){
        const notes=await NoteModel.find({"userID":decoded.userID})
        res.status(200).send({"msg":"All the Notes",notes})
    }
} catch (error) {
    res.status(400).send({"msg":error.message})
}
})


/**
 * @swagger
*  /notes/add:
*     post:
*       summary: To post a new note to the database
*       tags:
*          [Notes]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: "#/components/schemas/User"
*       responses:
*         200:
*           description: The Note was successfully registered
*           content:
*             application/json:
*               schema:
*                 $ref: "#/components/schemas/User"
 * 
 *  
 */

notesRoutes.post("/add",async(req,res)=>{
  try {
    const note=await NoteModel(req.body)
    await note.save()
    res.status(200).send({"msg":"A new note has been added"})
  } catch (error) {
    res.status(400).send({"msg":error.message}) 
  }
})



/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get the Note from the database
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Detailed information of note
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

notesRoutes.get("/:id",async(req,res)=>{
    let notes=await NoteModel.findOne({_id:req.params.id})
    res.status(200).send(notes)
})

/**
 * @swagger
 * /notes/update/{id}:
 *   patch:
 *     summary: Update notes details
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notes ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Note details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

notesRoutes.patch("/update/:id",async(req,res)=>{
try {
    await NoteModel.findByIdAndUpdate({_id:req.params.id},req.body)
    res.status(200).send({"msg":"Note has been updated"})
} catch (error) {
    res.status(400).send({"msg":error.message}) 
}
})



/**
 * @swagger
 * /notes/delete/{id}:
 *   delete:
 *     summary: Remove the note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The note was deleted
 *       404:
 *         description: The note was not found
 */
notesRoutes.delete("/delete/:id",async(req,res)=>{
try {
    await NoteModel.findByIdAndDelete({_id:req.params.id})
    res.status(200).send({"msg":"Note has been deleted"})
} catch (error) {
    res.status(400).send({"msg":error.message}) 
}
})

module.exports={notesRoutes}