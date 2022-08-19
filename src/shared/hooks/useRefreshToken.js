import { useDispatch } from "react-redux";
import axios from "../../api/axios";
import { refreshToken } from "../../features/user/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const res = await axios.get("/refresh", {
      withCredentials: true,
    });
    const action = refreshToken({ token: res.data.accessToken });
    dispatch(action);
    return res.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
