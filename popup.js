const setupScreen = document.getElementById("setup-screen");
const mainScreen = document.getElementById("main-screen");
const settingsLink = document.getElementById("settings-link");
const apiKeyInput = document.getElementById("api-key-input");
const saveKeyBtn = document.getElementById("save-key-btn");
const generateBtn = document.getElementById("generate-btn");
const promptEditor = document.getElementById("prompt-editor");
const promptInput = document.getElementById("prompt-input");
const sendBtn = document.getElementById("send-btn");
const loading = document.getElementById("loading");
const result = document.getElementById("result");
const commentOutput = document.getElementById("comment-output");
const copyBtn = document.getElementById("copy-btn");
const regenerateBtn = document.getElementById("regenerate-btn");
const includeCommentsCheckbox = document.getElementById("include-comments");
const gifKeywords = document.getElementById("gif-keywords");
const error = document.getElementById("error");
const errorMessage = document.getElementById("error-message");

// --- Style definitions ---
const STYLES = {
  chill: `STYLE: Chill & authentique
- Commentaire détendu, bienveillant, comme un pote qui scroll son feed
- Ton léger, positif sans être niais
- Peut partager une mini expérience perso liée au post`,

  controversial: `STYLE: Controversial / Opinion tranchée
- Donne un avis FORT qui challenge le postulat du post ou pose une vraie question de fond
- N'hésite pas à être clivant ou à pointer une faille dans le raisonnement
- Montre que tu réfléchis plus loin que le post, sois direct et sans filtre
- Pas méchant, mais honnête et cash — le genre de commentaire qui génère des réponses
- Peut commencer par une question rhétorique ou un "en vrai..." qui remet en question`,

  expert: `STYLE: Expert / Valeur ajoutée
- Apporte un insight, un conseil concret, ou une perspective technique que le post n'a pas mentionné
- Montre une vraie connaissance du sujet sans être condescendant
- Le genre de commentaire qui fait dire "ah pas con" — ajoute de la valeur réelle
- Peut corriger subtilement ou compléter le post avec un point que l'auteur a oublié`,

  drole: `STYLE: Drôle / Punchline
- Commentaire qui fait sourire ou rire
- Humour observationnel, autodérision, ou comparaison inattendue
- Peut être absurde ou décalé tant que c'est lié au contenu du post
- Le genre de commentaire qui récolte des "mdr" en réponse`,

  curieux: `STYLE: Curieux / Question sincère
- Pose UNE question précise et spécifique sur un détail du post
- La question doit montrer que tu as vraiment regardé/lu le contenu
- Pousse l'auteur à développer ou à partager plus — "curiosity gap"
- Le genre de question qui donne envie de répondre`,

  hype: `STYLE: Hype / Fanboy assumé
- Enthousiaste et survolté mais sur un détail PRÉCIS (pas générique)
- L'énergie d'un pote qui découvre un truc de fou
- Peut tagger mentalement un ami fictif ("genre j'aurais envoyé ça à mon pote direct")
- Max 1-2 emojis autorisés ici`,
};

let selectedStyle = "chill";
let lastPostContent = null;

// --- Badge toggle ---
document.querySelectorAll(".style-badge").forEach((badge) => {
  badge.addEventListener("click", () => {
    document.querySelector(".style-badge.active")?.classList.remove("active");
    badge.classList.add("active");
    selectedStyle = badge.dataset.style;
  });
});

// --- Build prompt with selected style ---
function buildPrompt(postContent) {
  return `Tu es un utilisateur Instagram authentique. Génère UN commentaire pour ce post.
Tu commentes le POST lui-même (la publication de l'auteur), PAS les commentaires des autres utilisateurs.

Contenu du post (caption + description des images):
\`\`\`
${postContent}
\`\`\`

${STYLES[selectedStyle]}

RÈGLES OBLIGATOIRES:
- Référence un détail SPÉCIFIQUE du post (jamais de compliment générique type "Super !" ou "J'adore !")
- 1-2 phrases max (sauf style expert/controversial où 2-4 phrases sont ok)
- Écris comme un jeune français GenZ sur Insta: phrases courtes, langage oral, pas de jargon marketing
- Glisse naturellement des expressions GenZ françaises quand ça colle au contexte: "en vrai", "genre", "chelou", "mdr", "le feu", "de fou", "bah", "j'avoue", "c'est chaud", "trop bien", "jsp", "haha", "ptdr", "stylé", "lol", ""p'ti", "AH !". N'en mets pas plus de 1-2 par commentaire, ça doit rester fluide pas forcé.
- TOUT le commentaire doit être écrit en minuscules, jamais de majuscules (même en début de phrase)
- Maximum 1 emoji, uniquement si ça sonne naturel (souvent 0 c'est mieux)
- JAMAIS de hashtags, de tags, de "DM moi", de promotion
- JAMAIS de phrases creuses: "tellement inspirant", "wow incroyable", "continue comme ça"
- Varie la structure: ne commence pas toujours par "J'aime" ou "C'est"
- Le commentaire doit montrer que tu as VRAIMENT lu/regardé le contenu

FORMAT DE RÉPONSE (respecte exactement ce format):
COMMENT: [ton commentaire ici]
GIFS: [3-4 mots-clés courts en anglais pour chercher un GIF pertinent sur Instagram, séparés par des virgules]`;
}

// --- Init ---
(async () => {
  try {
    const { apiKey } = await chrome.storage.local.get("apiKey");
    if (apiKey) {
      showMainScreen();
    }
  } catch (err) {
    console.error("Init error:", err);
  }
})();

// --- Show/hide screens ---
function showSetupScreen() {
  setupScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");
  settingsLink.classList.add("hidden");
}

function showMainScreen() {
  setupScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
  settingsLink.classList.remove("hidden");
  resetState();
}

function showPromptEditor(postContent) {
  lastPostContent = postContent;
  generateBtn.classList.add("hidden");
  promptEditor.classList.remove("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");
  loading.classList.add("hidden");
  promptInput.value = buildPrompt(postContent);
  promptInput.focus();
}

function showLoading() {
  loading.classList.remove("hidden");
  promptEditor.classList.add("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");
  generateBtn.classList.add("hidden");
}

function showResult(comment, gifs) {
  loading.classList.add("hidden");
  result.classList.remove("hidden");
  promptEditor.classList.add("hidden");
  generateBtn.classList.add("hidden");
  commentOutput.value = comment;

  gifKeywords.innerHTML = "";
  if (gifs && gifs.length > 0) {
    gifs.forEach((kw) => {
      const chip = document.createElement("span");
      chip.className = "gif-chip";
      chip.textContent = kw;
      chip.addEventListener("click", async () => {
        await navigator.clipboard.writeText(kw);
        chip.classList.add("gif-chip-copied");
        chip.textContent = "copied!";
        setTimeout(() => {
          chip.classList.remove("gif-chip-copied");
          chip.textContent = kw;
        }, 1200);
      });
      gifKeywords.appendChild(chip);
    });
  }
}

function showError(msg) {
  loading.classList.add("hidden");
  error.classList.remove("hidden");
  generateBtn.classList.remove("hidden");
  promptEditor.classList.add("hidden");
  errorMessage.textContent = msg;
}

function resetState() {
  loading.classList.add("hidden");
  result.classList.add("hidden");
  error.classList.add("hidden");
  promptEditor.classList.add("hidden");
  generateBtn.classList.remove("hidden");
}

// --- Save API key ---
saveKeyBtn.addEventListener("click", async () => {
  const key = apiKeyInput.value.trim();
  if (!key) return;
  try {
    await chrome.storage.local.set({ apiKey: key });
    showMainScreen();
  } catch (err) {
    console.error("Failed to save API key:", err);
    showError("Impossible de sauvegarder la clé API.");
  }
});

// --- Settings ---
settingsLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.storage.local.remove("apiKey", () => {
    apiKeyInput.value = "";
    showSetupScreen();
  });
});

// --- Step 1: Extract + show prompt ---
generateBtn.addEventListener("click", () => extractAndShowPrompt());
regenerateBtn.addEventListener("click", () => {
  if (lastPostContent) {
    showPromptEditor(lastPostContent);
  } else {
    extractAndShowPrompt();
  }
});

async function extractAndShowPrompt() {
  generateBtn.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.url?.includes("instagram.com")) {
      showError("Ouvrez un post Instagram avant de générer un commentaire.");
      return;
    }

    let postContent;
    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPostContent",
        includeComments: includeCommentsCheckbox.checked,
      });
      postContent = response?.content;
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPostContent",
        includeComments: includeCommentsCheckbox.checked,
      });
      postContent = response?.content;
    }

    if (!postContent) {
      showError(
        "Impossible d'extraire le contenu du post. Assurez-vous d'être sur un post Instagram."
      );
      return;
    }

    showPromptEditor(postContent);
  } catch (err) {
    showError(err.message || "Une erreur est survenue.");
  }
}

// --- Step 2: Send prompt ---
sendBtn.addEventListener("click", () => sendPrompt());

async function sendPrompt() {
  const prompt = promptInput.value.trim();
  if (!prompt) return;

  showLoading();

  try {
    const { apiKey } = await chrome.storage.local.get("apiKey");
    const raw = await callClaude(apiKey, prompt);
    const { comment, gifs } = parseResponse(raw);
    showResult(comment, gifs);
  } catch (err) {
    showError(err.message || "Une erreur est survenue.");
  }
}

function parseResponse(raw) {
  const commentMatch = raw.match(/COMMENT:\s*(.+?)(?:\nGIFS:|$)/s);
  const gifsMatch = raw.match(/GIFS:\s*(.+)/s);

  const comment = commentMatch ? commentMatch[1].trim() : raw.trim();
  const gifs = gifsMatch
    ? gifsMatch[1].split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return { comment, gifs };
}

async function callClaude(apiKey, prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5-20251101",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 401) {
      throw new Error("Clé API invalide. Vérifiez vos paramètres.");
    }
    throw new Error(
      body?.error?.message || `Erreur API (${res.status})`
    );
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Réponse vide de Claude.");
  }

  return text;
}

// --- Copy ---
copyBtn.addEventListener("click", async () => {
  const text = commentOutput.value;
  await navigator.clipboard.writeText(text);
  copyBtn.textContent = "✅ Copié !";
  setTimeout(() => {
    copyBtn.textContent = "📋 Copier";
  }, 1500);
});
