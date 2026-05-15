
import { getInitials } from "../utils/helper.js";

const Avatar = ({ name = "", src = "", size = 36 }) => {
  if (src) {
    return (
      <img
        src={src} alt={name}
        className="avatar"
        style={{ width: size, height: size }}
        onError={(e) => { e.target.style.display="none"; }}
      />
    );
  }
  return (
    <div
      className="avatar-placeholder"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

