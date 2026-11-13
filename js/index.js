const overlayFrame = document.getElementById("overlayiFrame");
let currentOverlay = null;

// Loads whichever overlay overlay.json selects
subscribeOverlayState(({ overlay }) => {
  if (!overlay || overlay === currentOverlay) return;

  currentOverlay = overlay;

  overlayFrame.src = new URL(
    "overlays/" + encodeURIComponent(overlay) + ".html",
    window.location.href
  ).href;

  document.title = overlay.charAt(0).toUpperCase() + overlay.slice(1);
}, 500);
