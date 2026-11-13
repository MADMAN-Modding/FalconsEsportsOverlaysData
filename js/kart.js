document.getElementById("schoolLogo").src =
  "../images/Esports-Logo.png?" + Math.floor(Math.random() * 1000000);

onOverlayState((state) => {
  // Gets the value of state as an int
  const winsLeft = +state["winsLeft"];
  const winsRight = +state["winsRight"];

  // Update the rounds won
  setRounds("left", 2, winsLeft, (element, won) => {
    element.style.fill = won ? "white" : "black";
  });
  setRounds("right", 2, winsRight, (element, won) => {
    element.style.fill = won ? "white" : "black";
  });

  // Updates the Team Names and week
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", state["week"]);
  setText("playerNamesLeft", state["playerNamesLeft"]);
  setText("playerNamesRight", state["playerNamesRight"]);
  setText("scoreLeft", state["scoreLeft"]);
  setText("scoreRight", state["scoreRight"]);

  const week = document.getElementById("week");

  if (+state["week"] > 9) {
    week.style.left = "1862px";
    week.style.top = "984px";
    week.style.fontSize = "40px";
  } else {
    week.style.left = "1870px";
    week.style.top = "970px";
    week.style.fontSize = "48px";
  }

  // Sets all the home team respective colors
  document.documentElement.style.setProperty("--homeTheme", state["teamColorLeft"]);
  document.documentElement.style.setProperty("--awayTheme", state["teamColorRight"]);

  document.getElementById("playerNamesLeft").style.top =
    state["playerNamesLeft"].length >= 24 ? "503px" : "509px";

  document.getElementById("playerNamesRight").style.top =
    state["playerNamesRight"].length <= 23 ? "536px" : "530px";
});
