onOverlayState((state) => {
  const winsLeft = +state["winsLeft"];
  const winsRight = +state["winsRight"];

  // Update the rounds won
  setRounds("left", 3, winsLeft, (element, won) => {
    element.style.backgroundColor = won ? state["teamColorLeft"] : "black";
  });
  setRounds("right", 3, winsRight, (element, won) => {
    element.style.backgroundColor = won ? state["teamColorRight"] : "black";
  });

  // Updates the Team Names and week
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", state["week"]);
  setText("playerNamesLeft", state["playerNamesLeft"]);
  setText("playerNamesRight", state["playerNamesRight"]);
  setText("scoreLeft", state["scoreLeft"]);
  setText("scoreRight", state["scoreRight"]);

  // Team Color Changing for left and right
  for (const side of ["Left", "Right"]) {
    const color = state["teamColor" + side];

    document.getElementById("namePlate" + side).style.backgroundColor = color;
    document.getElementById("namePlate" + side + "Slope").style.backgroundColor = color;
  }
});
