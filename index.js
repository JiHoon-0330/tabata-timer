const main = document.querySelector("main");
const ul = document.querySelector("main > ul");
const section = document.querySelector("section");
const form = document.querySelector("form");

document.querySelector("body").addEventListener("click", event => {
  if (event.target.dataset.type !== "icon") {
    return;
  }
  const {
    target: {
      dataset: { value, id }
    }
  } = event;
  value === "add" && showForm();
  value === "clear" && clearStorage();
  value === "start" && startTimer(id);
  value === "change" && changeData(id);
  value === "remove" && removeData(id);
});

const startTimer = id => {
  console.log(id);
};
const changeData = id => {
  getStorage(id, setForm);
};
const removeData = id => {
  const title = document.querySelector(`[id="${id}"] .li__title`).textContent;
  if (!confirm(`'${title}'를 삭제하시겠습니까?`)) {
    return;
  }
  removeStorage(id);
  document.querySelector(`[id="${id}"]`).remove();
};

const showForm = () => {
  !main.classList.contains("hidden") && main.classList.add("hidden");
  section.classList.contains("hidden") && section.classList.remove("hidden");
};

const hideForm = () => {
  !section.classList.contains("hidden") && section.classList.add("hidden");
  main.classList.contains("hidden") && main.classList.remove("hidden");
};

document.querySelector(".cancel").addEventListener("click", () => {
  hideForm();
});

const setForm = data => {
  const { id, title, work, rest, count } = data;
  document.querySelector("#hidden").value = id;
  document.querySelector("#title").value = title;
  document.querySelector("#work").value = work;
  document.querySelector("#rest").value = rest;
  document.querySelector("#count").value = count;
  showForm();
};

form.addEventListener("submit", event => {
  event.preventDefault();
  const id = document.querySelector("#hidden").value || Date.now();
  const title = document.querySelector("#title").value;
  const work = document.querySelector("#work").value;
  const rest = document.querySelector("#rest").value;
  const count = document.querySelector("#count").value;
  const data = {};
  data[id] = {
    id,
    title,
    work,
    rest,
    count
  };
  setStorage(data);

  form.reset();
  hideForm();
});

const printData = data => {
  const { id, title, work, rest, count } = data;
  const li = `<li id="${id}">
    <span title="시작">
      <i class="far fa-play-circle" data-type="icon" data-value="start" data-id="${id}"></i>
    </span>
    <div>
      <p class="li__title">${title}</p>
        <span class="li__work">${work}초</span>        
        <span class="li__rest">${rest}초</span>
        <span class="li__count">${count}회</span>
      </div>
    </div>
    <span class="icons">
      <i title="수정" class="fas fa-edit" data-type="icon" data-value="change" data-id="${id}"></i>
      <i title="삭제" class="far fa-trash-alt" data-type="icon" data-value="remove" data-id="${id}"></i>
    </span>
  </li>`;
  ul.innerHTML += li;
};

const printAllData = allData => {
  Object.keys(allData).forEach(item => {
    printData(allData[item]);
  });
};

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

const changeText = (oldValue, newValue) => {
  const keys = Object.keys(oldValue);
  keys.forEach(key => {
    if (oldValue[key] !== newValue[key]) {
      document.querySelector(
        `[id="${oldValue.id}"] .li__${key}`
      ).textContent = setText(newValue[key], key);
    }
  });
};

const setText = (text, type) => {
  switch (type) {
    case "title":
      return text;
    case "work":
    case "rest":
      return `${text}초`;
    case "count":
      return `${text}회`;
    default:
      console.log(`unknown type: ${type}`);
  }
};

const init = () => {
  getStorage(null, printAllData);
};

init();
