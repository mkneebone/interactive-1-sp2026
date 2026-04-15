const ROOMS = {
  1: {
    title: "Exam Room 1",
    character: "BullDog",
    image: "assets/images/BullDog.png",
    script: [
      "Bulldog: Woof! You're the new vet, right?",
      "Bulldog: If you work here out of love… is this free?",
      "MAKE_CHOICE",
    ],
    options: {
      A: "We still have fees, but I'll take good care of you.",
      B: "Yeah… I guess it's free for you.",
    },
    goodEnding:
      "Bulldog: I respect that. I'll pay. You're a good vet.\n" +
      "(The rest of your shift goes smoothly, and everything runs without issues).",
    badEnding:
      "Bulldog: Free?! I'm telling all my friends!\n" +
      "(By the end of your shift, more clients try to persuade you into giving cheap or free services).",
  },

  2: {
    title: "Exam Room 2",
    character: "Chihuahua",
    image: "assets/images/Chihuahua.png",
    script: [
      "Chihuahua: Hi!! WOW you're a real vet right?! This is SO cool!!",
      "Chihuahua: Can you tell me EVERYTHING you do here?!",
      "MAKE_CHOICE",
    ],
    options: {
      A: "I can explain a little, but I'm on the clock right now.",
      B: "Sure! Let me give you a full breakdown of everything!",
    },
    goodEnding:
      "Chihuahua: Ohhh that makes sense!! Thanks for explaining a bit!\n" +
      "(You stay professional and finish your shift smoothly while the Chihuahua happily observes quietly).",
    badEnding:
      "Chihuahua: WOW THIS IS AMAZING!! Tell me more!! And more!!\n" +
      "(You end up stuck explaining everything while your work piles up and the rest of your shift becomes chaotic).",
  },

  3: {
    title: "Exam Room 3",
    character: "Borzoi",
    image: "assets/images/Borzoi.png",
    script: [
      "Borzoi: Hello… I need help for my pet… I think.",
      "Borzoi: I'm not sure if we should do treatment… or maybe wait… or maybe something else?",
      "MAKE_CHOICE",
    ],
    options: {
      A: "Let's go step by step and decide what's best for your pet.",
      B: "If you're unsure, we should just skip treatment for now.",
    },
    goodEnding:
      "Borzoi: That actually helps… I feel better thinking it through slowly.\n" +
      "(With your guidance, a proper treatment plan is chosen and the pet receives the care it needs).",
    badEnding:
      "Borzoi: I guess… if I'm not sure, maybe I should just leave it.\n" +
      "(The uncertainty leads to no treatment being done, and the situation may worsen over time).",
  },

  4: {
    title: "Exam Room 4",
    character: "Golden Retriever",
    image: "assets/images/Golden.png",
    script: [
      "Golden R.: Hi! This is my first puppy visit ever!!",
      "Golden R.: I love him… but honestly… I think he's broken.",
      "Golden R.: He runs around ALL day like he's powered by chaos.",
      "MAKE_CHOICE",
    ],
    options: {
      A: "That's completely normal for a puppy. He just needs training and routine.",
      B: "Yeah… that sounds like a difficult dog. He might need medication.",
    },
    goodEnding:
      "Golden R.: Ohhh… so he's not broken? That's actually a relief.\n" +
      "(You explain puppy behavior and training basics, and Golden R. leaves more confident and happy).",
    badEnding:
      "Golden R.: Medication?! I knew something was wrong… I guess I was right to worry.\n" +
      "(Golden R. becomes overly anxious about normal puppy behavior and considers unnecessary treatment).",
  },

  5: {
    title: "Exam Room 5",
    character: "Red Cat",
    image: "assets/images/AngryCat.png",
    script: [
      "Red Cat: Okay… I'm watching you very closely.",
      "Red Cat: My cat sneezed twice yesterday. Twice. That's not normal, right?",
      "Red Cat: I've read a lot online and I just want to make sure you actually know what you're doing.",
      "Red Cat: Are you 100% certain you're qualified for this?",
      "MAKE_CHOICE",
    ],
    options: {
      A: "I understand your concern. I'll walk you through everything step by step so you feel confident in the care.",
      B: "Yes, I'm qualified. You don't need to question every decision—your cat is fine.",
    },
    goodEnding:
      "Red Cat: …Alright. I still worry, but I appreciate you explaining things clearly.\n" +
      "(You calmly walk Red Cat through the diagnosis. Their anxiety eases, and they trust your care by the end of the visit).",
    badEnding:
      "Red Cat: That didn't really answer my question…\n" +
      "(Red Cat becomes more suspicious and insists on second opinions, delaying treatment and increasing tension in the room).",
  },

  6: {
    title: "Exam Room 6",
    character: "Shaggy",
    image: "assets/images/Shaggy.png",
    script: [
      "Shaggy: Finally. Took you long enough.",
      "Shaggy: I've been waiting WAY too long in that lobby. This place is always slow.",
      "Shaggy: Also—before you even start—why is this going to cost so much? It's ridiculous.",
      "Shaggy: My cat's food alone costs more than my patience for this place.",
      "Shaggy: And don't even get me started on last time I was here…",
      "Shaggy: So tell me, are you actually going to do this properly or what?",
      "MAKE_CHOICE",
    ],
    options: {
      A: "I understand you're frustrated. Let's focus on your cat and I'll explain everything clearly step by step.",
      B: "If you're unhappy with the service, we can end the appointment here.",
    },
    goodEnding:
      "Shaggy: …Tch. Fine. Just do your job.\n" +
      "(You stay calm and professional, de-escalate the situation, and successfully complete the treatment without further conflict).",
    badEnding:
      "Shaggy: Unbelievable. This place is useless.\n" +
      "(The situation escalates into a heated argument, and Shaggy storms out before treatment is completed).",
  },

  7: {
    title: "Exam Room 7",
    character: "Puffy",
    image: "assets/images/Puffy.png",
    script: [
      "Puffy: Finally. Took you long enough.",
      "Puffy: I've been waiting WAY too long in that lobby. This place is always slow.",
      "Puffy: Also—before you even start—why is this going to cost so much? It's ridiculous.",
      "Puffy: My cat's food alone costs more than my patience for this place.",
      "Puffy: And don't even get me started on last time I was here…",
      "Puffy: So tell me, are you actually going to do this properly or what?",
      "MAKE_CHOICE",
    ],
    options: {
      A: "I understand you're frustrated. Let's focus on your cat and I'll explain everything clearly step by step.",
      B: "If you're unhappy with the service, we can end the appointment here.",
    },
    goodEnding:
      "Puffy: …Tch. Fine. Just do your job.\n" +
      "(You stay calm and professional, de-escalate the situation, and successfully complete the treatment without further conflict).",
    badEnding:
      "Puffy: Unbelievable. This place is useless.\n" +
      "(The situation escalates into a heated argument, and Puffy storms out before treatment is completed).",
  },

  8: {
    title: "Exam Room 8",
    character: "Cry",
    image: "assets/images/Cry.png",
    script: ["Cry: ...", "MAKE_CHOICE"],
    options: {
      A: "Are you okay?",
      B: "...",
    },
    goodEnding: "Cry: ...thank you for asking.",
    badEnding: "Cry: ...",
  },
};
