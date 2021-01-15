const setStorage = data => {
  chrome.storage.local.set(data);
};

const getStorage = (key, callback) => {
  chrome.storage.local.get(key, result => {
    if (key) {
      callback(result[key]);
    } else {
      callback(result);
    }
  });
};

const onChangeStorage = () => {
  chrome.storage.local.onChanged(result => {
    console.log(result);
  });
};

const removeStorage = key => {
  chrome.storage.local.remove(key);
};

const clearStorage = () => {
  if (!confirm("목록을 초기화하시겠습니까?")) {
    return;
  }
  chrome.storage.local.clear();
  ul.innerHTML = "";
};

chrome.storage.onChanged.addListener(changes => {
  console.log(`change`);
  const key = Object.keys(changes)[0];
  if (!changes[key].newValue) {
    return;
  }
  if (!changes[key].oldValue) {
    printData(changes[key].newValue);
  } else {
    changeText(changes[key].oldValue, changes[key].newValue);
  }
});
