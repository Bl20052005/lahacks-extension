const divs = document.querySelectorAll("div");

if (divs) {
  console.log(divs.length);
  const length = document.createElement("p");
  length.textContent = divs.length;
  length.classList.add("length");

  //   const div_arr = [...divs];
  //   div_arr.forEach((item) => {
  //     item.textContent = "hello!";
  //   });
}

chrome.storage.onChanged.addListener(async (tabId, info, tab) => {
  console.log("updated!");
});
