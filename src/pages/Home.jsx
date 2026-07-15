import videos from "../data/videos";
import VideoCard from "../components/VideoCard";

function Home() {
  return (
    <div className="container">
      <h1>🎓 Learning Portal</h1>

      <div className="grid">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Home;