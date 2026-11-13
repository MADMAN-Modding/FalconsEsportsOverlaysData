onOverlayState((state) => {
  const winsLeft = +state["winsLeft"];
  const winsRight = +state["winsRight"];

  // Update the rounds won
  setRounds("left", 3, winsLeft, (element, won) => {
    element.style.fill = won ? state["teamColorLeft"] : "black";
  });
  setRounds("right", 3, winsRight, (element, won) => {
    element.style.fill = won ? state["teamColorRight"] : "black";
  });

  document.getElementById("overlay").style.fill = state["teamColorLeft"];

  // Updates the Team Names and week
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", state["week"]);
});
