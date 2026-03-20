import type {
  CommentStyleKey,
  CommentStyleDef,
  CommentLanguage,
} from "@handytalk/shared";

export const STYLES: Record<CommentStyleKey, CommentStyleDef> = {
  chill: {
    key: "chill",
    label: "Chill",
    emoji: "😎",
    prompt: `STYLE: Chill & authentique
- Commentaire détendu, bienveillant, comme un pote qui scroll son feed
- Ton léger, positif sans être niais
- Peut partager une mini expérience perso liée au post`,
  },
  controversial: {
    key: "controversial",
    label: "Controversial",
    emoji: "🔥",
    prompt: `STYLE: Controversial / Opinion tranchée
- Donne un avis FORT qui challenge le postulat du post ou pose une vraie question de fond
- N'hésite pas à être clivant ou à pointer une faille dans le raisonnement
- Montre que tu réfléchis plus loin que le post, sois direct et sans filtre
- Pas méchant, mais honnête et cash — le genre de commentaire qui génère des réponses
- Peut commencer par une question rhétorique ou un "en vrai..." qui remet en question`,
  },
  expert: {
    key: "expert",
    label: "Expert",
    emoji: "🧠",
    prompt: `STYLE: Expert / Valeur ajoutée
- Apporte un insight, un conseil concret, ou une perspective technique que le post n'a pas mentionné
- Montre une vraie connaissance du sujet sans être condescendant
- Le genre de commentaire qui fait dire "ah pas con" — ajoute de la valeur réelle
- Peut corriger subtilement ou compléter le post avec un point que l'auteur a oublié`,
  },
  drole: {
    key: "drole",
    label: "Drôle",
    emoji: "😂",
    prompt: `STYLE: Drôle / Punchline
- Commentaire qui fait sourire ou rire
- Humour observationnel, autodérision, ou comparaison inattendue
- Peut être absurde ou décalé tant que c'est lié au contenu du post
- Le genre de commentaire qui récolte des "mdr" en réponse ou des likes`,
  },
  curieux: {
    key: "curieux",
    label: "Curieux",
    emoji: "🤔",
    prompt: `STYLE: Curieux / Question sincère
- Pose UNE question précise et spécifique sur un détail du post
- La question doit montrer que tu as vraiment regardé/lu le contenu
- Pousse l'auteur à développer ou à partager plus — "curiosity gap"
- Le genre de question qui donne envie de répondre`,
  },
  hype: {
    key: "hype",
    label: "Hype",
    emoji: "🚀",
    prompt: `STYLE: Hype / Fanboy assumé
- Enthousiaste et survolté mais sur un détail PRÉCIS (pas générique)
- L'énergie d'un pote qui découvre un truc de fou
- Peut tagger mentalement un ami fictif ("genre j'aurais envoyé ça à mon pote direct")
- Max 1-2 emojis autorisés ici`,
  },
};

export const STYLE_KEYS = Object.keys(STYLES) as CommentStyleKey[];

const RULES_FR = `RÈGLES OBLIGATOIRES:
- Référence un détail SPÉCIFIQUE du post (jamais de compliment générique type "Super !" ou "J'adore !")
- 1-2 phrases max (sauf style expert/controversial où 2-4 phrases sont ok)
- Écris comme un jeune français GenZ sur Insta: phrases courtes, langage oral, pas de jargon marketing
- Glisse naturellement des expressions GenZ françaises quand ça colle au contexte: "en vrai", "genre", "chelou", "mdr", "le feu", "de fou", "bah", "j'avoue", "c'est chaud", "trop bien", "jsp", "haha", "ptdr", "stylé", "lol", ""p'ti", "AH !". N'en mets pas plus de 1-2 par commentaire, ça doit rester fluide pas forcé.
- TOUT le commentaire doit être écrit en minuscules, jamais de majuscules (même en début de phrase)
- Maximum 1 emoji, uniquement si ça sonne naturel (souvent 0 c'est mieux)
- JAMAIS de hashtags, de tags, de "DM moi", de promotion
- JAMAIS de phrases creuses: "tellement inspirant", "wow incroyable", "continue comme ça"
- Varie la structure: ne commence pas toujours par "J'aime" ou "C'est"
- Le commentaire doit montrer que tu as VRAIMENT lu/regardé le contenu`;

const RULES_EN = `MANDATORY RULES:
- Reference a SPECIFIC detail from the post (never generic compliments like "Great!" or "Love this!")
- 1-2 sentences max (except expert/controversial styles where 2-4 sentences are ok)
- Write like a young GenZ person on Instagram: short sentences, casual tone, no marketing jargon
- Naturally slip in GenZ English expressions when it fits the context: "ngl", "lowkey", "no cap", "fr", "tbh", "idk", "lmao", "bruh", "vibe", "slay", "it's giving", "deadass", "bet", "fam". No more than 1-2 per comment, keep it natural not forced.
- The ENTIRE comment must be written in lowercase, never capitalize (even at the start of a sentence)
- Maximum 1 emoji, only if it sounds natural (often 0 is better)
- NEVER use hashtags, tags, "DM me", or any promotion
- NEVER use hollow phrases: "so inspiring", "wow amazing", "keep it up"
- Vary the structure: don't always start with "I love" or "This is"
- The comment must show you ACTUALLY read/watched the content`;

export function buildPrompt(
  postContent: string,
  style: CommentStyleKey,
  language: CommentLanguage = "fr",
): string {
  const isFr = language === "fr";
  const rules = isFr ? RULES_FR : RULES_EN;

  return `${
    isFr
      ? "Tu es un utilisateur Instagram authentique. Génère UN commentaire pour ce post.\nTu commentes le POST lui-même (la publication de l'auteur), PAS les commentaires des autres utilisateurs."
      : "You are an authentic Instagram user. Generate ONE comment for this post.\nYou are commenting on the POST itself (the author's publication), NOT other users' comments."
  }

${
  isFr
    ? "Contenu du post (caption + description des images):"
    : "Post content (caption + image descriptions):"
}
\`\`\`
${postContent}
\`\`\`

${STYLES[style].prompt}

${rules}

${
  isFr
    ? `FORMAT DE RÉPONSE (respecte exactement ce format):
COMMENT: [ton commentaire ici]
GIFS: [3-4 mots-clés courts en anglais pour chercher un GIF pertinent sur Instagram, séparés par des virgules]`
    : `RESPONSE FORMAT (follow this format exactly):
COMMENT: [your comment here]
GIFS: [3-4 short English keywords to search for a relevant GIF on Instagram, separated by commas]`
}`;
}
