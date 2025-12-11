import express from 'express'
import cors from 'cors'
import dotenv from "dotenv" 
import mongoose from 'mongoose' 
import {User} from './user.js'


const app = express()
dotenv.config()

const connectDb = () => {
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_PORT,
    MONGO_DB,
    MONGO_HOSTNAME,
  } = process.env;
  const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
  
  mongoose.connect(url).then(function () {
      console.log("mongodb conectado");
    })
    .catch(function (err) { 
        console.log(err)
    });
};



const port = 3005
app.use(cors({ origin: '*' })) // cors
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

app.listen(port, function () {
    connectDb()
    console.log(`Api corriendo en http://localhost:${port}!`)
})

app.get('/', (req,res) =>{
    console.log('first api')
    res.status(200).send('Hola, la apipi esta funcionando');
});


app.post('/',async(req,res) =>{
    try{
        var data = req.body

        var newUser = new User(data)

        await newUser.save()
        res.status(200).send({
            success: true,
            message: "Se registro el usuario",
            outcome:[]
        })
    }
    catch (err) {
        res.status(400).send({
            success:false,
            message:"Error al intentar crear el usuario , intente otra vez",
            outcome:[]
        })
    }
})

app.get('/usuarios',async (req,res) =>{

    try{
        var usuarios = await User.find().exec()

        res.status(200).send({
            success: true,
            message: "Se encontraron a los usarios",
            outcome:[usuarios]
        })
    }
    catch ( err){
        res.status(400).send({
            success:false,
            message:"Error al intentar obtener a los usuarios , intente otra vez",
            outcome:[]
        })
    }
})


app.patch('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;   
    const data = req.body;       


    const usuarioActualizado = await User.findByIdAndUpdate(
      id,
      { $set: data },             
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).send({
        success: false,
        message: "Usuario no encontrado",
        outcome: []
      });
    }

    res.status(200).send({
      success: true,
      message: "Usuario actualizado correctamente",
      outcome: [usuarioActualizado]
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Error al intentar actualizar el usuario, intente otra vez",
      outcome: []
    });
  }
});
