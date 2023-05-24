import { User } from "../models/index.js";
import bcrypt from "bcryptjs";
import { jwt } from "../utils/jwt.js";

//TODO: Funcion que registra al usuario en la DB
const register = (req, res) => {
      const { email, password } = req.body;

      const user = new User({
            email: email.toLowerCase(),
      });

      //TODO - encriptando la contraseña del usuario
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      user.password = hashPassword;

      user.save((error, userStorage) => {
      
            if (error) {
                  res.status(400).send({ msg: "error creando usuario" });
            } else {
                  res.status(201).send(userStorage);
            }
      });

      //res.status(201).send({ msg: "Usuario creado" });
};

//TODO: Funcion para iniciar sesion
const login = (req, res) => {
      const { email, password } = req.body;

      const emailLowerCase = email.toLowerCase();

      User.findOne({ email: emailLowerCase }, (error, userStorage) => {
            if (error) {
                  res.status(500).send({ msg: "Error del servidor" });
            } else {
                  //? -- To check a password:
                  bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
                        if (bcryptError) {
                              res.status(500).send({ msg: "Error en el servidor" });
                        } else if (!check) {
                              res.status(400).send({ msg: "Usuario o contraseñas incorrectos" });
                        } else {
                              res.status(200).send({
                                    access: jwt.createAccessToken(userStorage),
                                    refresh: jwt.createRefreshToken(userStorage),
                              });
                        }
                  });
            }
      });
};




//TODO: Funcion para refrescar el token
const refreshAccessToken = (req, res) => {
      const { refreshToken } = req.body;

      !refreshToken && res.status(400).send({ msg: "token requerido" });

      const hasExpired = jwt.checkIfTokenExpired(refreshToken);
      if (hasExpired) res.status(400).send({ msg: "token expirado" });

      const { user_id } = jwt.decode(refreshToken);

      User.findById(user_id, (error, userStorage) => {
            if (error) {
                  res.status(500).send({ msg: "Error del servidor" });
            } else {
                  res.status(200).send({
                        accessToken: jwt.createAccessToken(userStorage),
                  });
            }
      });
};









export const AuthController = {
      register,
      login,
      refreshAccessToken,
};
