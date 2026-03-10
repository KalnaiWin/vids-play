import { getColorFromFirstLetter } from "../types/helperFunction";

interface avatarProps {
  name: string;
  size: string;
  image: string;
}

const AvatarPage = ({ name, size, image }: avatarProps) => {
  return (
    <>
      {image ? (
        <img
          src={image}
          alt={name}
          className={`size-${size} rounded-full object-cover`}
        />
      ) : (
        <div
          style={{
            backgroundColor: getColorFromFirstLetter(name),
          }}
          className={`size-${size} rounded-full uppercase flex items-center justify-center font-bold text-white cursor-pointer`}
        >
          {name?.slice(0, 1)}
        </div>
      )}
    </>
  );
};

export default AvatarPage;
