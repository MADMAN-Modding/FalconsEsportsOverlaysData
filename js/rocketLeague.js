function changeBackgroundColor(id, color) {
  document.getElementById(id).style.fill = color;
}

onOverlayState((state) => {
  // Gets the value of state as an int
  const winsLeft = +state["winsLeft"];
  const winsRight = +state["winsRight"];

  const scoreArray = ["arcOne", "arcTwo", "arcThree", "arcFour"];

  // Update the rounds won, each win lights an arc and the fifth fills the circle
  for (const [side, wins] of [["Left", winsLeft], ["Right", winsRight]]) {
    for (let i = 1; i <= 4; i++) {
      document.getElementById(scoreArray[i - 1] + side).style.stroke =
        wins >= i ? "#FFF" : "#000";
    }

    document.getElementById("circle" + side).style.fill =
      wins == 5 ? "white" : "black";
  }

  // Sets all the home team respective colors
  changeBackgroundColor("cardLeft", state["teamColorLeft"]);

  // Set the away team respective colors
  changeBackgroundColor("cardRight", state["teamColorRight"]);

  // Update Text values
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", state["week"]);
});
