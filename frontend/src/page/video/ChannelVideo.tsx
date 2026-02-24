import { typeVideo } from "../../types/constant";

export interface UserProps {
  userId: string;
}

const ChannelVideo = ({ userId }: UserProps) => {
  return (
    <div>
      <div className="flex gap-5">
        {typeVideo.map((type) => (
          <div key={type.path}>{type.name}</div>
        ))}
      </div>
    </div>
  );
};

export default ChannelVideo;

export const HomePageVideo = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export const ShortVideo = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export const Video = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export const Livestream = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export const Playlist = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export const Post = ({ userId }: UserProps) => {
  return (
    <div>
      <div></div>
    </div>
  );
};
