/**
 * Real-Time Kokoro-82M Neural Audio Synthesis Client
 * Connects directly to GPU worker at server.ibrasoft.com or local endpoint.
 */

let activeAudioElement: HTMLAudioElement | null = null;

export async function playKokoroNeuralAudio(
  text: string,
  voice: string = "af_bella",
  speed: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Stop any currently playing audio
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // Endpoints to attempt
  const ttsEndpoints = [
    "https://server.ibrasoft.com/api/v1/tts/synthesize",
    "http://85.218.235.6:8088/synthesize",
  ];

  for (const endpoint of ttsEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudioElement = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          activeAudioElement = null;
          if (onEnd) onEnd();
        };

        await audio.play();
        return true;
      }
    } catch {
      // Try next endpoint or fallback
    }
  }

  // Fallback to browser SpeechSynthesis if remote server is unreachable
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.8, Math.min(1.5, speed));

    const allVoices = window.speechSynthesis.getVoices();
    const isFemale = !voice.startsWith("am") && !voice.startsWith("bm") && !voice.startsWith("em") && !voice.startsWith("dm") && !voice.startsWith("im") && !voice.startsWith("pm") && !voice.startsWith("jm") && !voice.startsWith("zm") && !voice.startsWith("hm");
    
    if (isFemale) {
      const femaleMatch = allVoices.find((v) => ["zira", "jenny", "aria", "samantha", "female", "natural"].some(k => v.name.toLowerCase().includes(k))) || allVoices[0];
      if (femaleMatch) utterance.voice = femaleMatch;
      utterance.pitch = 1.2;
    } else {
      const maleMatch = allVoices.find((v) => ["david", "guy", "mark", "male"].some(k => v.name.toLowerCase().includes(k))) || allVoices[0];
      if (maleMatch) utterance.voice = maleMatch;
      utterance.pitch = 0.9;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  if (onEnd) onEnd();
  return false;
}

export function stopNeuralAudio() {
  if (typeof window === "undefined") return;
  if (activeAudioElement) {
    activeAudioElement.pause();
    activeAudioElement.currentTime = 0;
    activeAudioElement = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
