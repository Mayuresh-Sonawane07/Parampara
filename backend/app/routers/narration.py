import re
import httpx
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response

router = APIRouter(prefix="/api/narration", tags=["Narration"])

# In-memory LRU cache for synthesized regional audio clips
AUDIO_CACHE: dict[str, bytes] = {}

def chunk_text_for_tts(text: str, max_len: int = 140) -> list[str]:
    """
    Chunks text into natural speech phrases <= max_len characters to stay within
    Google Translate TTS per-request length limit.
    """
    clean_text = re.sub(r'\s+', ' ', text).strip()
    if not clean_text:
        return []
    if len(clean_text) <= max_len:
        return [clean_text]

    # Split by major punctuation first (sentence/clause boundaries)
    # Includes Indian Danda (।), period, comma, question mark, exclamation
    delimiters = re.compile(r'([।\.!?,\;])')
    raw_tokens = delimiters.split(clean_text)
    
    # Reassemble tokens with their delimiters
    phrases = []
    i = 0
    while i < len(raw_tokens):
        part = raw_tokens[i].strip()
        if i + 1 < len(raw_tokens) and raw_tokens[i + 1] in '।\.!?,\;':
            part = part + raw_tokens[i + 1]
            i += 2
        else:
            i += 1
        if part:
            phrases.append(part)

    # Now group phrases into chunks <= max_len
    chunks = []
    current_chunk = ""
    for phrase in phrases:
        # If phrase itself exceeds max_len, split by words
        if len(phrase) > max_len:
            if current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = ""
            words = phrase.split(' ')
            w_chunk = ""
            for w in words:
                if len(w_chunk) + len(w) + 1 > max_len and w_chunk:
                    chunks.append(w_chunk.strip())
                    w_chunk = w
                else:
                    w_chunk = f"{w_chunk} {w}".strip()
            if w_chunk:
                chunks.append(w_chunk.strip())
        else:
            if len(current_chunk) + len(phrase) + 1 > max_len and current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = phrase
            else:
                current_chunk = f"{current_chunk} {phrase}".strip()

    if current_chunk:
        chunks.append(current_chunk.strip())

    return [c for c in chunks if c]

@router.get("/audio")
async def get_narration_audio(
    text: str = Query(..., min_length=1, max_length=1500),
    lang: str = Query("en", pattern="^(en|hi|mr|pa|ta|bn)$")
):
    """
    Provides authentic native pronunciation audio for regional Indian languages:
    - Marathi (mr) for Warli (Maharashtra)
    - Punjabi (pa) for Thathera (Punjab)
    - Tamil (ta) for Toda (Tamil Nadu)
    - Bengali (bn) for Chhau (East India)
    - Hindi (hi) & English (en)
    """
    normalized_text = text.strip()
    cache_key = f"{lang}:{normalized_text}"
    if cache_key in AUDIO_CACHE:
        return Response(
            content=AUDIO_CACHE[cache_key],
            media_type="audio/mpeg",
            headers={"Cache-Control": "public, max-age=86400"}
        )

    chunks = chunk_text_for_tts(normalized_text, max_len=140)
    if not chunks:
        raise HTTPException(status_code=400, detail="Empty text supplied")

    tts_url = "https://translate.google.com/translate_tts"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    audio_segments = []
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            for chunk in chunks:
                params = {
                    "ie": "UTF-8",
                    "tl": lang,
                    "client": "tw-ob",
                    "q": chunk
                }
                res = await client.get(tts_url, params=params, headers=headers)
                if res.status_code == 200 and len(res.content) > 50:
                    audio_segments.append(res.content)
                else:
                    raise HTTPException(
                        status_code=502,
                        detail=f"TTS service upstream returned status {res.status_code} for chunk: {chunk[:30]}..."
                    )

        combined_audio = b"".join(audio_segments)
        if len(combined_audio) == 0:
            raise HTTPException(status_code=500, detail="Generated audio stream was empty")

        # Cache audio (limit cache size)
        if len(AUDIO_CACHE) > 200:
            AUDIO_CACHE.clear()
        AUDIO_CACHE[cache_key] = combined_audio

        return Response(
            content=combined_audio,
            media_type="audio/mpeg",
            headers={
                "Cache-Control": "public, max-age=86400",
                "Content-Length": str(len(combined_audio)),
                "Accept-Ranges": "bytes"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(e)}")
