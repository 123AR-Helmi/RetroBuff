/**
 * audio.js
 * Handles unlocking the audio and mute toggle functionality.
 */

document.addEventListener('DOMContentLoaded', function () {
  const audioOverlay = document.getElementById('audioOverlay');
  const bgMusic = document.getElementById('bgMusic');
  const muteBtn = document.getElementById('muteBtn');

  function initAudio() {
    bgMusic.volume = 0.5;
    bgMusic.play()
      .then(() => console.log('Background music is playing'))
      .catch(err => console.error('Background music playback error:', err));
  }

  audioOverlay.addEventListener('click', function () {
    initAudio();
    audioOverlay.style.display = 'none';
  });

  muteBtn.addEventListener('click', function () {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? 'Unmute Music' : 'Mute Music';
  });
});
