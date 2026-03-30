import { useSelector } from "react-redux";
import { saveMessagingDeviceToken } from "../lib/firebase/messaging";
import type { RootState } from "../store";

const TestPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="mx-5 p-5 text-white">
      <div
        onClick={() => {
          saveMessagingDeviceToken(user?._id);
        }}  
        className="cursor-pointer"
      >
        Collect FCM Token
      </div>
    </div>
  );
};

export default TestPage;
