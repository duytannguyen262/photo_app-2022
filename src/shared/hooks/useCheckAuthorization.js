import { useSelector } from "react-redux";

const useCheckAuthorization = ({ authorId, sharedTo }) => {
  const user = useSelector((state) => state.auth.user);

  const checkAuthorization = () => {
    if (!user) {
      return false;
    }
    if (authorId === user.id) {
      return true;
    }
  };

  return checkAuthorization();
};

export default useCheckAuthorization;
