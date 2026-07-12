export const SOUND_KEYS = {
  select: 'sfx_select',
  move: 'sfx_move',
  convert: 'sfx_convert',
  invalid: 'sfx_invalid',
  confirm: 'sfx_confirm',
  victory: 'sfx_victory',
} as const;

const SOUND_FILES: Record<string, string[]> = {
  [SOUND_KEYS.select]: ['/assets/select.mp3'],
  [SOUND_KEYS.move]: ['/assets/move.mp3'],
  [SOUND_KEYS.convert]: ['/assets/convert.mp3'],
  [SOUND_KEYS.invalid]: ['/assets/invalid.mp3'],
  [SOUND_KEYS.confirm]: ['/assets/confirm.mp3'],
  [SOUND_KEYS.victory]: ['/assets/victory.mp3'],
};

const MUSIC_KEYS = {
  bgm: 'bgm',
};

const MUSIC_FILES: Record<string, string[]> = {
  [MUSIC_KEYS.bgm]: ['/assets/music.mp3'],
};

export function preloadSoundEffects(scene: Phaser.Scene) {
    for (const [key, paths] of Object.entries(SOUND_FILES)) {
        if (!scene.cache.audio.exists(key)) {
            scene.load.audio(key, paths);
        }
    }

    for (const [key, paths] of Object.entries(MUSIC_FILES)) {
        if (!scene.cache.audio.exists(key)) {
            scene.load.audio(key, paths);
        }
    }
}

export function unlockAudio(scene: Phaser.Scene) {
  try {
    const soundManager = scene.sound as unknown as {
      unlock?: () => void;
      context?: AudioContext;
      mute?: boolean;
      volume?: number;
    };

    soundManager.mute = false;
    soundManager.volume = Math.max(soundManager.volume ?? 1, 0.85);
    soundManager.unlock?.();

    if (soundManager.context?.state === 'suspended') {
      void soundManager.context.resume();
    }
  } catch {
    // Audio unlock should never block gameplay.
  }
}

export function playSound(scene: Phaser.Scene, key: string, volume = 0.55) {
  try {
    unlockAudio(scene);
    if (!scene.cache.audio.exists(key)) return;
    scene.sound.play(key, { volume });
  } catch {
    // Missing, locked, or unsupported audio should never break gameplay.
  }
}
