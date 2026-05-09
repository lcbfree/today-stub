const themes = [
  {
    id: "thermal_default",
    label: "默认热敏纸",
    background: "#fffaf1",
    foreground: "#2f2924",
    accent: "#b85c4b",
  },
  {
    id: "night_stub",
    label: "晚间票根",
    background: "#2f302f",
    foreground: "#fff7ea",
    accent: "#d9a866",
  },
  {
    id: "exhibit_ticket",
    label: "展览门票",
    background: "#f6f0e7",
    foreground: "#302f2c",
    accent: "#486b63",
  },
];

function getThemes() {
  return themes.map((theme) => ({ ...theme }));
}

function getTheme(themeId) {
  return themes.find((theme) => theme.id === themeId) || themes[0];
}

module.exports = {
  getTheme,
  getThemes,
  themes,
};
