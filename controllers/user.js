import { User } from "../models/index.js";
import { getFilePath } from "../utils/index.js";


//Obtener datos del usuario logueado.
const getLoggedUserData = async (req, res) => {

      const { user_id } = req.user;

      try {
            const response = await User.findById(user_id).select(["-password"]);

            if (!response) {
                  res.status(400).send({ msg: "No se ha encontrado el usuario" });
            } else {
                  res.status(200).send(response);
            }
      } catch (error) {
            res.status(500).send({ msg: "Error del servidor" });
      }

}


const getUsers = async (req, res) => {
      try {
            const { user_id } = req.user;        //$ne: permite que no se devuelva el mismo usuario que esta logueado    
            const users = await User.find({ _id: { $ne: user_id } }).select(["-password"]);

            if (!users) {
                  res.status(400).send({ msg: "No se han encontardo usuarios" });
            } else {
                  res.status(200).send(users);
            }
      } catch (error) {
            res.status(500).send({ msg: "Error del servidor" });
      }
}


const getUser = async (req, res) => {
      const { id } = req.params;

      try {
            const response = await User.findById(id).select(["-password"]);

            if (!response) {
                  res.status(400).send({ msg: "No se ha encontrado el usuario" });
            } else {
                  res.status(200).send(response);
            }
      } catch (error) {
            res.status(500).send({ msg: "Error del servidor" });
      }
}


const updateUser = (req, res) => {
      const { user_id } = req.user;
      const userData = req.body;

      if (req.files.avatar) {
            const imagePath = getFilePath(req.files.avatar);
            userData.avatar = imagePath;
      }


      User.findByIdAndUpdate({_id: user_id}, userData, (error) => {
            if(error){
                  res.status(400).send({msg: "Error al actualizar el usuario"})
            }else{
                  res.status(200).send(userData)
            }
      })

           
};









export const UserController = {

      getLoggedUserData,
      getUsers,
      getUser,
      updateUser
      
}