import { register, login, renewAccessToken } from "./auth.controller";
import { updateUser, deleteUser } from "./managerUser.controller";

export default {
  register,
  login,
  renewAccessToken,
  updateUser,
  deleteUser,
};
