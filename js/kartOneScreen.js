document.getElementById("schoolLogo").src =
  "../images/Esports-Logo.png?" + Math.floor(Math.random() * 1000000);

onOverlayState((state) => {
  // Updates the Team Names and week
  setText("teamNameLeft", state["teamNameLeft"]);
  setText("teamNameRight", state["teamNameRight"]);
  setText("week", "Week " + state["week"]);
  setText("playerNamesLeft", state["playerNamesLeft"]);
  setText("playerNamesRight", state["playerNamesRight"]);
  setText("scoreLeft", state["scoreLeft"]);
  setText("scoreRight", state["scoreRight"]);

  // Sets all the home team respective colors
  document.documentElement.style.setProperty("--homeTheme", state["teamColorLeft"]);
  document.documentElement.style.setProperty("--awayTheme", state["teamColorRight"]);
});
