// Delivers overlay.json to `callback` whenever it changes.
// The app's server pushes changes as events, older servers don't have /events so the file is polled instead.
function subscribeOverlayState(callback, pollInterval = 2000) {
  let last = null;

  // Only counts as delivered once the callback worked, so a page that wasn't ready is retried
  function deliver(state) {
    const text = JSON.stringify(state);
    if (text === last) return;

    try {
      callback(state);
      last = text;
    } catch (error) {
      console.error("Overlay update failed:", error);
    }
  }

  function poll() {
    fetch("../json/overlay.json", { cache: "no-store" })
      .then((response) => response.json())
      .then(deliver)
      .catch(() => {})
      .finally(() => setTimeout(poll, pollInterval));
  }

  if (!window.EventSource) {
    poll();
    return;
  }

  const source = new EventSource(new URL("/events", window.location.href).href);
  let opened = false;

  source.onopen = () => {
    opened = true;
  };

  source.onmessage = (event) => {
    try {
      deliver(JSON.parse(event.data));
    } catch (error) {
      console.error("Bad overlay event:", error);
    }
  };

  // Once connected the browser reconnects by itself, a failure before that means there are no events
  source.onerror = () => {
    if (!opened) {
      source.close();
      poll();
    }
  };
}
