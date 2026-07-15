import { useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import videos from "../data/videos";

function VideoPage() {
  const { id } = useParams();

  const video = videos.find((v) => v.id === Number(id));

  const videoRef = useRef(null);

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem(`bookmarks-${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      `bookmarks-${id}`,
      JSON.stringify(bookmarks)
    );
  }, [bookmarks, id]);

  useEffect(() => {
  const savedTime = localStorage.getItem(`progress-${id}`);

  if (savedTime && videoRef.current) {
    videoRef.current.currentTime = Number(savedTime);
  }
}, [id]);

useEffect(() => {
  const interval = setInterval(() => {
    if (videoRef.current) {
      localStorage.setItem(
        `progress-${id}`,
        videoRef.current.currentTime
      );
    }
  }, 1000);

  return () => clearInterval(interval);
}, [id]);
useEffect(() => {
  const disableRightClick = (e) => e.preventDefault();

  document.addEventListener("contextmenu", disableRightClick);

  return () => {
    document.removeEventListener("contextmenu", disableRightClick);
  };
}, []);

  if (!video) {
    return <h2 style={{ textAlign: "center" }}>Video Not Found</h2>;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const addBookmark = () => {
    const currentTime = Math.floor(videoRef.current.currentTime);

    const name =
      prompt("Enter Bookmark Name (Optional)") ||
      `Bookmark ${bookmarks.length + 1}`;

    const bookmark = {
      id: Date.now(),
      name,
      time: currentTime,
    };

    setBookmarks([...bookmarks, bookmark]);
  };

  const jumpToBookmark = (time) => {
    videoRef.current.currentTime = time;
    videoRef.current.play();
  };

  const deleteBookmark = (bookmarkId) => {
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.id !== bookmarkId
    );

    setBookmarks(updatedBookmarks);
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  }}
>
  <h1>{video.title}</h1>

  <span
    style={{
      color: "#2563eb",
      fontWeight: "bold",
      fontSize: "20px",
    }}
  >
    🎓 Learning Portal
  </span>
</div>

      <div style={{ position: "relative" }}>
  <video
    ref={videoRef}
    width="100%"
    height="500"
    controls
  >
    <source src={video.video} type="video/mp4" />
    Your browser does not support HTML5 video.
  </video>

  <div
    style={{
      position: "absolute",
      top: "15px",
      right: "20px",
      color: "rgba(255,255,255,0.5)",
      fontSize: "24px",
      fontWeight: "bold",
      pointerEvents: "none",
    }}
  >
    Learning Portal
  </div>
</div>

      <br />
      <br />

      <button
        onClick={addBookmark}
        style={{
          width: "100%",
          padding: "12px",
          background: "#4169E1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        📌 Add Bookmark
      </button>

      <h2 style={{ marginTop: "30px" }}>Bookmarks</h2>

      {bookmarks.length === 0 ? (
        <p>No bookmarks added.</p>
      ) : (
        bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f4f4f4",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <div>
              <strong>{bookmark.name}</strong>

              <br />

              <small>{formatTime(bookmark.time)}</small>
            </div>

            <div>
              <button
                onClick={() => jumpToBookmark(bookmark.time)}
                style={{
                  marginRight: "10px",
                  background: "#4169E1",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ▶ Resume
              </button>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VideoPage;