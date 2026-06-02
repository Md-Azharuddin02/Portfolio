import spotify from "../../assets/images/spotify.jpg";
import BraidedAI from "../../assets/images/App.Braided.png";
import OneSpot from "../../assets/images/OneSpot.png";


const projects = [
  {
    name: "Spotify Clone",
    description:
      "Created a Spotify clone with React, featuring playlists, playback controls, and a sleek UI, mimicking the original's core functionality.",
    extended:
      "A responsive music interface focused on playback controls, playlist browsing, and a familiar product feel. The project highlights component structure, visual polish, and fast client-side interactions.",
    img: spotify,
    url: "https://spotifyclone-seven-phi.vercel.app/",
    repo: "https://github.com/Md-Azharuddin02",
    tech: ["React", "JavaScript", "CSS"],
    gallery: [spotify],
  },
  {
    name: "Braided AI",
    description:
      "This web application is primarily built as an AI chat application that enables users to interact with an intelligent assistant to get information, solve queries, and perform various tasks efficiently.",
    extended:
      "An AI chat product experience with conversational UI, API integration, session-oriented flows, and interaction details designed for practical assistant-style usage.",
    img: BraidedAI,
    url: "https://app.braidedai.com",
    repo: "https://github.com/Md-Azharuddin02",
    tech: ["AI Chat", "React", "API", "LLM"],
    gallery: [BraidedAI],
  },
  {
    name: "OneSpot.tv",
    description: "This web application is built as a video upload platform where users can securely upload and manage videos for clients, making it easy to store, organize, and share video files when needed.",
    extended:
      "A client-facing video upload and management platform with secure access, organized media handling, and a clean interface for repeated operational use.",
    img: OneSpot,
    url: "https://onespot.tv/login",
    repo: "https://github.com/Md-Azharuddin02",
    tech: ["Video", "Cloud", "Security"],
    gallery: [OneSpot],
  }
];

export default projects;
