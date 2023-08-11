import { register, login, renewAccessToken } from "./auth.service";
import { updateUser, deleteUser } from "./managerUser.service";

export default {
  register,
  login,
  renewAccessToken,
  updateUser,
  deleteUser,
};
