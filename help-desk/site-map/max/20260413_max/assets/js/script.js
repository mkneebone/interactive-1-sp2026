// =============================================
// 1. SCENES
//
//   text    - the paragraph shown to the player
//   image   - which image to display
//   choices - the buttons the player can click
//             each choice needs a label and a next (the scene it leads to)
//
// To add a new scene: copy one of these blocks, give it a new name,
// and make sure at least one choice in another scene points to it.
// =============================================

const scenes = {
  // Scene 1:
  scene1: {
    text: "You climb the top of this mountain overlooking the city, everything seems so small and far away from here. You noticed a stranger siting by himself, looking out at the city, What do you do?",
    image: "image1",
    choices: [
      { label: "Approach the stranger.", next: "scene2" },
      {
        label: "Pick a small flower growing by the path.",
        next: "scene1",
        setFlag: "hasFlower",
        hideIfFlag: "hasFlower",
      },
    ],
  },

  // Scene 2:
  scene2: {
    text: "'Nice to meet you.'",
    image: "image2",
    choices: [
      { label: "Who are you?", next: "scene3" },
      { label: "...", next: "mute" },
    ],
  },

  // Scene 3:
  scene3: {
    text: "'I didn't expect to see someone up here, especially at this time, let me introduce myself: my names Maxwell but you can call me Max.'",
    image: "image3",
    choices: [
      { label: "Why are you up here?", next: "scene4" },
      { label: "You greet Max and introduce yourself.", next: "scene5" },
      { label: "...", next: "mute" },
    ],
  },

  // Scene 4
  scene4: {
    text: "With a warm smile, he gestures for you to sit down.",
    image: "image4",
    choices: [
      { label: "You sit down on a nearby rock.", next: "scene6" },
      {
        label: "No thanks. You bid him farewell, turning back to the city.",
        next: "scene1",
      },
      {
        label: "...",
        next: "mute",
      },
    ],
  },

  // Scene 5
  scene5: {
    text: "'Woah, that's a really *ahem* unique name…!? I haven't come across that one before…'",
    image: "image5",
    choices: [
      { label: "Why are you up here?", next: "scene4" },
      {
        label: "You bid him farewell, turning back to the city.",
        next: "scene1",
      },
    ],
  },

  // Scene 6
  scene6: {
    text: "You sit down on a nearby rock. For a moment, you both just watch the city lights below.",
    image: "image4",
    choices: [
      {
        label: "Ask Max what he comes up here to think about.",
        next: "scene7",
      },
      {
        label: "Offer Max the flower you picked on the way up.",
        next: "scene8",
        requiredFlag: "hasFlower",
      },
      {
        label: "Stand up and head back down the mountain.",
        next: "scene1",
      },
    ],
  },

  // Scene 7
  scene7: {
    text: "'It helps me clear my head,' Max says. 'Everything makes a little more sense from up here.'",
    image: "image5",
    choices: [],
  },

  // Scene 8
  scene8: {
    text: "Max smiles and accepts the flower. 'Thanks,' he says. 'This is a wonderful gift.'",
    image: "image5",
    choices: [],
  },

  // Mute:
  mute: {
    text: "'Hmm not the talkative type are you? Well that doesn't matter your still welcome here.'",
    image: "mute",
    choices: [
      { label: "Why are you up here?", next: "scene4" },
      { label: "Walk away to look back at the city.", next: "scene1" },
    ],
  },
};

// =============================================
// 2. SELECTED ELEMENTS
// =============================================

const story = document.querySelector("#story");
const choicesEl = document.querySelector("#choices");
const ascii = document.querySelector("#ascii");
const reset = document.querySelector("#reset");

// Track simple game state here.
const playerState = {
  hasFlower: false,
};

// =============================================
// 3. GO TO SCENE
// This runs every time the player clicks a choice.
// =============================================

function goToScene(name) {
  // --- Look up the scene ---
  const scene = scenes[name];

  let storyText = scene.text;
  const availableChoices = scene.choices.filter(function (choice) {
    if (choice.requiredFlag && !playerState[choice.requiredFlag]) {
      return false;
    }

    if (choice.hideIfFlag && playerState[choice.hideIfFlag]) {
      return false;
    }

    return true;
  });

  // --- Update the page ---
  story.textContent = storyText;
  ascii.textContent = asciiArt[scene.image];

  // Remove the old buttons
  choicesEl.innerHTML = "";

  // Create a button for each choice in this scene
  for (let i = 0; i < availableChoices.length; i++) {
    const choice = availableChoices[i];

    const btn = document.createElement("p");
    btn.className = "choice";
    btn.textContent = choice.label;

    btn.addEventListener("click", function () {
      if (choice.setFlag) {
        playerState[choice.setFlag] = true;
      }

      goToScene(choice.next);
    });

    choicesEl.appendChild(btn);
  }

  // restart if there are no choices
  if (availableChoices.length === 0) {
    reset.style.display = "block";
  } else {
    reset.style.display = "none";
  }
}

// =============================================
// RESTART
// =============================================

reset.addEventListener("click", function () {
  playerState.hasFlower = false;
  goToScene("scene1");
});

// =============================================
// INITIALIZE WITH FIRST SCENE
// =============================================
goToScene("scene1");
