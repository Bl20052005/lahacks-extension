chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }
  
    //   const divs = document.querySelectorAll("div");
  
    //   if (divs) {
    //     console.log(divs.length);
    //     // const length = document.createElement("p");
    //     // length.textContent = divs.length;
    //     // length.classList.add("length");
  
    //     //   const div_arr = [...divs];
    //     //   div_arr.forEach((item) => {
    //     //     item.textContent = "hello!";
    //     //   });
    //   }
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
  });