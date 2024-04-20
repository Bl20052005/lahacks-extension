document.getElementById("analysis").addEventListener("click", () => {
  document.getElementById("analysis").classList.add("fonts");

  chrome.storage.local.set({ welcome: "hello" }).then(() => {
    console.log("Value is set");
  });
});
