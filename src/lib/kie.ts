import { CHARACTER_STYLES, ILLUSTRATION_STYLES } from '@/lib/constants';

/** Create a KIE AI task and return the taskId. Does NOT wait for completion. */
export async function createKIETask(params: {
  imageUrl: string;
  prompt: string;
  aspectRatio?: string;
  resolution?: '1K' | '2K';
}): Promise<string> {
  const KIE_API_KEY = process.env.KIE_API_KEY;
  if (!KIE_API_KEY) throw new Error('KIE_API_KEY not configured');

  const createRes = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KIE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'nano-banana-2',
      input: {
        prompt: params.prompt,
        aspect_ratio: params.aspectRatio || '3:4',
        resolution: params.resolution || '2K',
        output_format: 'jpg',
        image_input: [params.imageUrl],
      },
    }),
  });

  const createBody = await createRes.text();
  let taskData: any;
  try {
    taskData = JSON.parse(createBody);
  } catch {
    throw new Error(`KIE AI create failed (非JSON回應): ${createBody.slice(0, 300)}`);
  }

  // KIE AI returns HTTP 200 even on errors — must check body code
  if (!createRes.ok || taskData.code !== 200) {
    throw new Error(`KIE AI create failed: ${taskData.msg || taskData.error || createRes.statusText || 'unknown error'}`);
  }
  const taskId: string = taskData.data?.taskId;
  if (!taskId) throw new Error('KIE AI: no taskId in response');

  return taskId;
}

/**
 * Check the status of a KIE AI task.
 * Returns the image URL if successful, null if still processing.
 * Throws if the task failed.
 */
export async function checkKIETaskStatus(taskId: string): Promise<{
  state: 'processing' | 'success' | 'failed';
  imageUrl?: string;
}> {
  const KIE_API_KEY = process.env.KIE_API_KEY;
  if (!KIE_API_KEY) throw new Error('KIE_API_KEY not configured');

  const pollRes = await fetch(
    `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
    {
      headers: { Authorization: `Bearer ${KIE_API_KEY}` },
    }
  );

  if (!pollRes.ok) {
    return { state: 'processing' };
  }

  const pollBody = await pollRes.text();
  let pollData: any;
  try {
    pollData = JSON.parse(pollBody);
  } catch {
    return { state: 'processing' };
  }
  const state: string = pollData.state || pollData.data?.state || '';

  // Extract image URL from various possible response formats
  let imageUrl = pollData.imageUrl || pollData.data?.imageUrl || '';

  // KIE AI stores result URLs in a nested JSON string: data.resultJson = '{"resultUrls":["..."]}'
  if (!imageUrl && pollData.data?.resultJson) {
    try {
      const parsed = JSON.parse(pollData.data.resultJson);
      if (parsed.resultUrls?.length > 0) {
        imageUrl = parsed.resultUrls[0];
      }
    } catch {}
  }

  if (state === 'success' && imageUrl) {
    return { state: 'success', imageUrl };
  } else if (state === 'fail' || state === 'failed') {
    return { state: 'failed' };
  }

  return { state: 'processing' };
}

/** Synchronous: create task + poll until done (use in non-serverless or local dev only). */
export async function generateCardImage(params: {
  imageUrl: string;
  prompt: string;
}): Promise<string> {
  const taskId = await createKIETask(params);

  // Poll for result (up to 90 seconds)
  const maxAttempts = 30;
  const pollInterval = 3000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollInterval));
    const result = await checkKIETaskStatus(taskId);
    if (result.state === 'success' && result.imageUrl) return result.imageUrl;
    if (result.state === 'failed') throw new Error('KIE AI generation failed');
  }

  throw new Error('KIE AI generation timed out');
}

export function buildKIEPrompt(params: {
  styleType: 'character' | 'illustration';
  styleId: string;
  customPrompt?: string;
  festival: string;
  decorations: string[];
  greetingText: string;
  extraInstructions?: string;
  textPosition?: string;
  colorTone?: string;
  cardRatio?: string;
}): string {
  const styles = params.styleType === 'character' ? CHARACTER_STYLES : ILLUSTRATION_STYLES;
  const styleDef = styles.find((s) => s.id === params.styleId);

  const parts: string[] = [];

  // Base style prompt
  if (styleDef) {
    if (params.styleId.startsWith('custom-')) {
      parts.push(`${styleDef.prompt}${params.customPrompt || ''}`);
    } else {
      parts.push(styleDef.prompt);
    }
  } else {
    // Fallback
    if (params.styleType === 'character') {
      parts.push('Keep the face identical. Transform this person with a creative style.');
    } else {
      parts.push('Transform this photo with a beautiful artistic style.');
    }
  }

  // Card ratio / aspect
  if (params.cardRatio && params.cardRatio !== 'auto') {
    const ratioLabels: Record<string, string> = {
      '3:4': 'vertical 3:4 portrait format (tall)',
      '4:3': 'horizontal 4:3 landscape format (wide)',
      '1:1': 'square 1:1 format',
    };
    const label = ratioLabels[params.cardRatio] || params.cardRatio;
    parts.push(`Compose the image in ${label}.`);
  }

  // Festival context
  parts.push(`Festival/Occasion: ${params.festival}`);

  // Decorations
  if (params.decorations.length > 0) {
    parts.push(`Include decorations: ${params.decorations.join(', ')}`);
  }

  // Greeting text with 3D embossed effect
  if (params.greetingText) {
    parts.push(`Render the greeting text "${params.greetingText}" prominently on the card with a 3D embossed effect — raised lettering with depth, shadow, and a tactile pressed-into-surface appearance.`);
  }

  // Text position instruction
  if (params.textPosition && params.textPosition !== 'auto') {
    if (params.textPosition === 'bottom') {
      parts.push('Place the greeting text at the BOTTOM of the card, below the main image area. Ensure no text appears at the top.');
    } else if (params.textPosition === 'top') {
      parts.push('Place the greeting text at the TOP of the card, above the main image area. Ensure no text appears at the bottom.');
    }
  }

  // Color tone instruction
  if (params.colorTone && params.colorTone !== 'auto') {
    const tonePrompts: Record<string, string> = {
      warm: 'Use warm golden tones — rich amber, soft orange, and warm cream colors. Cozy and inviting atmosphere.',
      cool: 'Use cool blue-purple tones — icy blue, lavender, and silver colors. Clean, elegant, and serene atmosphere.',
      bright: 'Use bright vibrant tones — vivid colors, high saturation, energetic and lively. Bold and cheerful atmosphere.',
      pastel: 'Use soft pastel tones — gentle pink, baby blue, mint green, and lavender. Dreamy, delicate, and romantic atmosphere.',
    };
    const tonePrompt = tonePrompts[params.colorTone];
    if (tonePrompt) parts.push(tonePrompt);
  }

  // Extra instructions
  if (params.extraInstructions) {
    parts.push(`Extra instructions: ${params.extraInstructions}`);
  }

  // Final quality instruction
  parts.push('Output as a beautiful greeting card. High quality, clean composition, warm and festive.');

  return parts.join('. ');
}
