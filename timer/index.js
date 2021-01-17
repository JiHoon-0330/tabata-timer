const sectionTimer = document.querySelector(".timer");
const sectionFinish = document.querySelector(".finish");
const timerTitle = document.querySelector(".timer__title");
const timerTime = document.querySelector(".timer__time");
const timerCount = document.querySelector(".timer__count");
const timerState = document.querySelector(".timer__state");
const timeArr = [];
let readyTime = 5;
let running = true;
let maxCount = null;
let currentCount = null;
let index = 0;
let maxIndex = 0;

const beep = new Audio(
  "../sound/Short Beep Tone-SoundBible.com-1937840853.mp3"
);
const beep2 = new Audio("../sound/Electronic_Chime-KevanGC-495939803.mp3");
const finishSound = new Audio(
  "../sound/zapsplat_multimedia_game_sound_basic_digital_retro_fanfare_level_complete_achievement_005_40461.mp3"
);

document.querySelector(".cancel").addEventListener("click", () => {
  whale.sidebarAction.show({
    url: whale.runtime.getURL("../index.html")
  });
});

const getTimer = data => {
  const { title, work, rest, count } = data;
  maxCount = count;
  maxIndex = count === 1 ? 1 : (count - 1) * 2 + 1;
  timerTitle.textContent = title;
  timerTime.textContent = readyTime--;
  timerState.textContent = `준비하세요`;
  timeArr.push(rest);
  timeArr.push(work);
  runTimer();
};

document.querySelector(".timer").addEventListener("click", () => {
  if (document.querySelector(".timer__title").textContent !== "") {
    if (!running) {
      runTimer(timerTime.textContent);
    } else {
      stopTimer();
    }
  }
});

const runTimer = currentTime => {
  running = true;
  let time = null;
  const currentIndex = index + 1;
  if (!index) {
    time = currentTime || readyTime;
  } else {
    time = currentTime || timeArr[index % 2];
  }
  interval = setInterval(() => {
    if (currentIndex !== maxCount && time <= 3) {
      beep.play();
    }
    if (time <= 1) {
      clearInterval(interval);
      if (index < maxIndex) {
        index++;
        runTimer();
        setTimeout(() => {
          beep2.play();
        }, 1000);
      } else {
        interval = null;
        running = false;
        setTimeout(() => {
          showFinish();
          goHome();
        }, 1000);
      }
    }

    timerTime.textContent = time--;
    timerCount.textContent = `${
      currentIndex === 1 ? "" : `${parseInt(currentIndex / 2)} / ${maxCount}`
    }`;
    timerState.textContent = `${
      currentIndex === 1
        ? `준비하세요`
        : `${currentIndex % 2 === 0 ? `시작!` : `잠깐 휴식`}`
    }`;
  }, 1000);
};

const stopTimer = () => {
  running = false;
  if (interval !== null) {
    clearInterval(interval);
  }
};

const showFinish = () => {
  finishSound.play();
  sectionFinish.classList.remove("hidden");
  sectionTimer.classList.add("hidden");
};

const goHome = () => {
  setTimeout(() => {
    whale.sidebarAction.show({
      url: whale.runtime.getURL("../index.html")
    });
  }, 5000);
};

const init = () => {
  getStorage("currentRun", getTimer);
};

init();
