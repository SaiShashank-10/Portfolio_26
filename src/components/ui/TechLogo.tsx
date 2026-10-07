import { withBasePath } from "@/lib/basePath";

export const BRAND: Record<string, string> = {
  "Apache NetBeans": "apachenetbeanside",
  Cloudinary: "cloudinary",
  "Hugging Face Spaces": "huggingface",
  "Hugging Face (ViT)": "huggingface",
  MediaPipe: "mediapipe",
  "Razorpay API": "razorpay",
  YOLOv8: "yolo",
  "Computer Vision (YOLO/TF)": "tensorflow",
  Java: "java",
  C: "c",
  Python: "python",
  Dart: "dart",
  JavaScript: "javascript",
  HTML: "html5",
  CSS: "css3",
  "React.js": "react",
  Flutter: "flutter",
  "Next.js": "nextjs",
  Firebase: "firebase",
  FastAPI: "fastapi",
  "Node.js": "nodejs",
  Supabase: "supabase",
  "Cloudflare Workers": "cloudflare",
  PostgreSQL: "postgresql",
  "Visual Studio Code": "vscode",
  Git: "git",
  "GitHub Actions": "githubactions",
  Canva: "canva",
  OpenCV: "opencv",
  "Scikit-learn": "scikitlearn",
  Plotly: "plotly",
  Streamlit: "streamlit",
};
export const CONCEPT: Record<string, string> = {
  "Computer Vision":
    "M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0",
  "Agentic AI":
    "M12 3v4m0 10v4M3 12h4m10 0h4M7 7l-3-3m13 13 3 3M7 17l-3 3M17 7l3-3M8 8h8v8H8Z",
  "REST APIs": "m8 7-5 5 5 5m8-10 5 5-5 5m-5 2 2-14",
  SQL: "M4 6c0-4 16-4 16 0s-16 4-16 0Zm0 0v12c0 4 16 4 16 0V6M4 12c0 4 16 4 16 0",
  Geolocation:
    "M12 22S4 14 4 9a8 8 0 0 1 16 0c0 5-8 13-8 13Zm3-13a3 3 0 1 0-6 0 3 3 0 0 0 6 0",
};
export const isBrand = (name: string) => Boolean(BRAND[name]);
export default function TechLogo({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  if (isBrand(name))
    return (
      <img
        src={withBasePath(`/logos/${BRAND[name]}.svg`)}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        loading="lazy"
      />
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={CONCEPT[name] ?? "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8Z"}
      />
    </svg>
  );
}
