import { useNavigate, useParams } from "react-router-dom";

const RoomStreaming = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  return (
    <div>
      <div>RoomStreaming</div>
    </div>
  );
};

export default RoomStreaming;
