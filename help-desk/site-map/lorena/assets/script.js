const zone1 = document.querySelector("#zone1");
const zone2 = document.querySelector("#zone2");
const zone3 = document.querySelector("#zone3");
const images = document.querySelector("#images");
const backButton = document.querySelector("#back-button");
const inventoryList = document.querySelector("#inventory-list");
const inventoryEmpty = document.querySelector("#inventory-empty");

const imgGallery = [
  "assets/images/IMG_7269.jpg", // 0
  "assets/images/IMG_7274.jpg", // 1
  "assets/images/IMG_7275.jpg", // 2
];
const strangeSymbol = "Strange Symbol";
const history = [];
const inventory = [];

function saveState(
  state = {
    image: images.getAttribute("src"),
    zone1: zone1.style.display,
    zone2: zone2.style.display,
    zone3: zone3.style.display,
  },
) {
  history.push(state);

  backButton.hidden = false;
}

function addClue(zone) {
  const clueName = zone.dataset.clue;

  if (!clueName || inventory.includes(clueName)) {
    return;
  }

  inventory.push(clueName);

  const listItem = document.createElement("li");
  listItem.textContent = clueName;
  inventoryList.appendChild(listItem);
  inventoryEmpty.hidden = true;
}

function hasInventoryItem(itemName) {
  return inventory.includes(itemName);
}

function showLockedStartScene() {
  images.src = initialState.image;
  zone1.style.display = "none";
  zone2.style.display = "none";
  zone3.style.display = "none";
}

zone1.style.display = "block";
zone2.style.display = "none";
zone3.style.display = "none";

const initialState = {
  image: images.getAttribute("src"),
  zone1: zone1.style.display,
  zone2: zone2.style.display,
  zone3: zone3.style.display,
};

zone1.addEventListener("click", () => {
  saveState();
  addClue(zone1);
  images.src = imgGallery[0];
  zone1.style.display = "none";
  zone2.style.display = "block";
});

zone2.addEventListener("click", () => {
  saveState();
  addClue(zone2);
  images.src = imgGallery[1];
  zone2.style.display = "none";
  zone3.style.display = "block";
});

zone3.addEventListener("click", () => {
  history.length = 0;
  saveState({ ...initialState });
  addClue(zone3);
  images.src = imgGallery[2];
  zone3.style.display = "none";
});

backButton.addEventListener("click", () => {
  const previousState = history.pop();

  if (!previousState) {
    return;
  }

  if (
    previousState.image === initialState.image &&
    hasInventoryItem(strangeSymbol)
  ) {
    showLockedStartScene();
  } else {
    images.src = previousState.image;
    zone1.style.display = previousState.zone1;
    zone2.style.display = previousState.zone2;
    zone3.style.display = previousState.zone3;
  }

  backButton.hidden = history.length === 0;
});
