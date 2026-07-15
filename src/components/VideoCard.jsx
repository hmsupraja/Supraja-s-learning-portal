import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <div className="card">
      <img src={video.thumbnail} alt={video.title} />

      <h2>{video.title}</h2>

      <p>{video.description}</p>

      <Link to={`/video/${video.id}`}>
        <button>Watch Video</button>
      </Link>
    </div>
  );
}

export default VideoCard;