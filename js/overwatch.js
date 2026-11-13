function changeBackgroundColor(id, color) {
  document.getElementById(id).style.backgroundColor = color;
}

onOverlayState((state) => {
  // Gets the value of state as an int
  const winsLeft = +state["winsLeft"];
  const winsRight = +state["winsRight"];

  // Update the rounds won
  setRounds("left", 3, winsLeft, (element, won) => {
    element.style.backgroundColor = won ? "white" : "black";
  });
  setRounds("right", 3, winsRight, (element, won) => {
    element.style.backgroundColor = won ? "white" : "black";
  });

  // Sets all the home team respective colors
  const teamColorLeft = state["teamColorLeft"];
  changeBackgroundColor("teamNameLeftBackground", teamColorLeft);
  changeBackgroundColor("leftRoundsBack", teamColorLeft);
  changeBackgroundColor("weekBackground", teamColorLeft);

  // Set the away team respective colors
  const teamColorRight = state["teamColorRight"];
  changeBackgroundColor("teamNameRightBackground", teamColorRight);
  changeBackgroundColor("rightRoundsBack", teamColorRight);

  // Update Text values
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", state["week"]);
});
