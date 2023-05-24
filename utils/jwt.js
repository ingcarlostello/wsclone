import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../constants.js";

const createAccessToken = (user) => {
      return jsonwebtoken.sign(
            {
                  tokenType: "access",
                  user_id: user._id,
                  iat: Date.now(), // fecha de creacion del token
            },
            JWT_SECRET_KEY,
            { expiresIn: "24h" }
      );
};


const createRefreshToken = (user) => {



      return jsonwebtoken.sign(
            {
                  tokenType: "refresh",
                  user_id: user._id,
                  iat: Date.now(), // fecha de creacion del token
            },
            JWT_SECRET_KEY,
            { expiresIn: "30d" }
      );

}

const decode = (token) => {
      return jsonwebtoken.decode(token, JWT_SECRET_KEY, true)
}


const checkIfTokenExpired = (token) => {

      const {exp} = decode(token)
      const currentDate = new Date().getTime();

      if(exp <= currentDate){
            return true
      }

      return false

}


export const jwt = {
      createAccessToken,
      createRefreshToken,
      decode,
      checkIfTokenExpired

}
