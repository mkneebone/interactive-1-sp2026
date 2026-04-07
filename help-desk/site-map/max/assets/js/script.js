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
    choices: [{ label: "Approach the stranger.", next: "scene2" }],
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

// =============================================
// 3. GO TO SCENE
// This runs every time the player clicks a choice.
// =============================================

function goToScene(name) {
  // --- Look up the scene ---
  const scene = scenes[name];

  let storyText = scene.text;

  // --- Update the page ---
  story.textContent = storyText;
  ascii.textContent = asciiArt[scene.image];

  // Remove the old buttons
  choicesEl.innerHTML = "";

  // Create a button for each choice in this scene
  for (let i = 0; i < scene.choices.length; i++) {
    const choice = scene.choices[i];

    const btn = document.createElement("p");
    btn.className = "choice";
    btn.textContent = choice.label;

    btn.addEventListener("click", function () {
      goToScene(choice.next);
    });

    choicesEl.appendChild(btn);
  }

  // restart if there are no choices
  if (scene.choices.length === 0) {
    reset.style.display = "block";
  } else {
    reset.style.display = "none";
  }
}

// =============================================
// RESTART
// =============================================

reset.addEventListener("click", function () {
  goToScene("scene1");
});

// =============================================
// INITIALIZE WITH FIRST SCENE
// =============================================
goToScene("scene1");
