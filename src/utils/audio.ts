import likesound from "@/assets/sound/likesound.mp3";
import primarysound from "@/assets/sound/notification-sound.mp3";
export const playLikeSound = () => {
  const audio = new Audio(likesound);
  audio.play();
};

export const playPrimarySound = () => {
  const audio = new Audio(primarysound);
  audio.play();
};
