"use strict";

const essays = {
  focus: {
    caption: "素材示范 / 01",
    text: "当繁华向他招手，他选择让脚步停在实验室门前。徐晨阳的大学四年，没有市区的坐标，却有精神的远方。所谓专注，不是世界变小了，而是一个人的内心，足以容纳更大的世界。"
  },
  choice: {
    caption: "素材示范 / 02",
    text: "人生从不缺少热闹的去处，难的是选择一条安静的路。从上坟的课桌到深海的实验，徐晨阳一次次把难题留给自己，把漂亮的履历留在身后。选择的价值，往往不在得到多少掌声，而在愿意为一个答案，付出多少无人知晓的光阴。"
  },
  devotion: {
    caption: "素材示范 / 03",
    text: "有人以名字被记住，有人以无名被铭记。徐晨阳隐姓埋名十几年，把个人的光亮藏进深海，把岁月的重量写进一组组参数。直到世界终于听见他的故事，我们才明白：真正的奉献，是让别人拥有安宁，而自己习惯沉默。"
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById("essay-panel");
const essayText = document.getElementById("essay-text");
const copyStatus = document.getElementById("copy-status");
let activeTopic = "focus";
let copyRequest = 0;

function selectTopic(tab) {
  activeTopic = tab.dataset.topic;
  copyRequest += 1;
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tab.id);
  panel.querySelector(".essay-caption").textContent = essays[activeTopic].caption;
  essayText.textContent = essays[activeTopic].text;
  copyStatus.textContent = "";
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTopic(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectTopic(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

document.getElementById("copy-essay").addEventListener("click", async () => {
  const request = ++copyRequest;
  const text = essays[activeTopic].text;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    if (request === copyRequest) copyStatus.textContent = "已复制。下笔之前，请先对他的含金量表示敬意。";
  } catch {
    if (request !== copyRequest) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(essayText);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "浏览器未允许自动复制，已选中文字，请按 Ctrl+C（Mac 按 ⌘C）。";
  }
});

const secretDialog = document.getElementById("secret-dialog");
const openFile = document.getElementById("open-file");

function closeFile() {
  secretDialog.close();
}

openFile.addEventListener("click", () => secretDialog.showModal());
document.getElementById("close-file").addEventListener("click", closeFile);
document.getElementById("acknowledge").addEventListener("click", closeFile);
secretDialog.addEventListener("click", (event) => {
  if (event.target !== secretDialog) return;
  const bounds = secretDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeFile();
});
secretDialog.addEventListener("close", () => openFile.focus({ preventScroll: true }));
