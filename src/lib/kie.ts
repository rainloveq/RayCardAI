import { CHARACTER_STYLES, ILLUSTRATION_STYLES } from '@/lib/constants';

export async function generateCardImage(params: {
  imageUrl: string;
  prompt: string;
}): Promise<string> {
  const KIE_API_KEY = process.env.KIE_API_KEY;
  if (!KIE_API_KEY) throw new Error('KIE_API_KEY not configured');

  // Step 1: Create task
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
        aspect_ratio: 'auto',
        resolution: '2K',
        output_format: 'jpg',
        image_input: [params.imageUrl],
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(`KIE AI create failed: ${err.msg || createRes.statusText}`);
  }

  const taskData = await createRes.json();
  const taskId: string = taskData.data?.taskId;
  if (!taskId) throw new Error('KIE AI: no taskId in response');

  // Step 2: Poll for result (up to 90 seconds)
  const maxAttempts = 30;
  const pollInterval = 3000; // 3 seconds

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollInterval));

    const pollRes = await fetch(
      `https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: { Authorization: `Bearer ${KIE_API_KEY}` },
      }
    );

    if (!pollRes.ok) continue;

    const pollData = await pollRes.json();
    const state = pollData.state || pollData.data?.state;

    if (state === 'success') {
      const imageUrl = pollData.imageUrl || pollData.data?.imageUrl;
      if (imageUrl) return imageUrl;
    } else if (state === 'fail' || state === 'failed') {
      throw new Error('KIE AI generation failed');
    }
    // 'generating' or 'waiting' → continue polling
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

  // Festival context
  parts.push(`Festival/Occasion: ${params.festival}`);

  // Decorations
  if (params.decorations.length > 0) {
    parts.push(`Include decorations: ${params.decorations.join(', ')}`);
  }

  // Greeting text with 3D embossed effect (like wishgen)
  if (params.greetingText) {
    parts.push(`Render the greeting text "${params.greetingText}" prominently on the card with a 3D embossed effect — raised lettering with depth, shadow, and a tactile pressed-into-surface appearance.`);
  }

  // Extra instructions
  if (params.extraInstructions) {
    parts.push(`Extra instructions: ${params.extraInstructions}`);
  }

  // Final quality instruction
  parts.push('Output as a beautiful greeting card. High quality, clean composition, warm and festive.');

  return parts.join('. ');
}
