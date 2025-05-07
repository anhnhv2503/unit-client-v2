import sound from "@/assets/sound/notification-sound.mp3";
import { toast } from "sonner";

const Test = () => {
  const audio = new Audio(sound);

  const handleToast = () => {
    toast.success("This is a success toast!", {
      duration: 3000,
      style: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontSize: "16px",
        padding: "10px",
        borderRadius: "5px",
      },
    });
    audio.play();
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Test Audio</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => {
          audio.play();
        }}
      >
        Play Sound
      </button>
      <audio controls className="mt-4">
        <source src={sound} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
        onClick={handleToast}
      >
        Show Toast
      </button>
    </div>
  );
};

export default Test;
