import { Chat } from "../models/index.js";

const create = async (req, res) => {
      const { participant_id_one, participant_id_two } = req.body;

      const searchExistingChatOne = await Chat.findOne({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
      });

      const searchExistingChatTwo = await Chat.findOne({
            participant_two: participant_id_two,
            participant_one: participant_id_one,
      });

      if (searchExistingChatOne || searchExistingChatTwo) {
            res.status(200).send({ msg: "ya tienes un chat con este usuario" });
            return; // para detenr la ejecucion del if
      }

      const chat = new Chat({
            participant_one: participant_id_one,
            participant_two: participant_id_two,
      });

      chat.save((error, chatStorage) => {
            if (error) {
                  res.status(400).send({ msg: "error creando chat" });
            } else {
                  res.status(201).send(chatStorage);
            }
      });
};

const getAllChats = async (req, res) => {
      const { user_id } = req.user;

      Chat.find({
            $or: [{ participant_one: user_id }, { participant_two: user_id }],
      })
            .populate("participant_one")
            .populate("participant_two")
            .exec(async (error, chats) => {
                  //exec permite retorna una promesa si el callback no es proveido
                  if (error) {
                        return res.status(400).send({ msg: "Error al obtener los chats" });
                  }

                  //   const arrayChats = [];
                  //   for await (const chat of chats) {
                  //     const response = await ChatMessage.findOne({ chat: chat._id }).sort({
                  //       createdAt: -1,
                  //     });

                  //     arrayChats.push({
                  //       ...chat._doc,
                  //       last_message_date: response?.createdAt || null,
                  //     });
                  //   }

                  //res.status(200).send(arrayChats);
                  res.status(200).send(chats);
            });
};

const deleteChat = async (req, res) => {
      const chat_id = req.params.id;

      Chat.findByIdAndDelete(chat_id, (error) => {
            if (error) {
                  res.status(400).send({ msg: "Error al eliminar el chat" });
            } else {
                  res.status(200).send({ msg: "chat eliminado" });
            }
      });
};

const getChat = async (req, res) => {
      const chat_id = req.params.id;

      Chat.findById(chat_id, (error, chatStorage) => {
            if (error) {
                  res.status(400).send({ msg: "Error al obtener el chat" });
            } else {
                  res.status(200).send(chatStorage);
            }
      }).populate("participant_one").populate("participant_two")
};

export const chatController = {
      create,
      getAllChats,
      deleteChat,
      getChat,
};
