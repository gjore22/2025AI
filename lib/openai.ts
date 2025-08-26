interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateDeviceDescription(deviceInfo: {
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  ipAddress: string;
  location?: string;
}): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your environment variables.');
  }

  const prompt = `Generate a professional, technical description for a network device with the following details:
- Device Name: ${deviceInfo.name}
- Device Type: ${deviceInfo.type}
- Manufacturer: ${deviceInfo.manufacturer || 'Not specified'}
- Model: ${deviceInfo.model || 'Not specified'}
- IP Address: ${deviceInfo.ipAddress}
- Location: ${deviceInfo.location || 'Not specified'}

Please provide a concise, informative description that includes:
1. The device's primary function and role in the network
2. Key technical specifications (if manufacturer/model provided)
3. Typical use cases and deployment scenarios
4. Security considerations if relevant
5. Integration capabilities

Keep the description professional, between 100-200 words, and focus on practical networking information.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a network administrator and technical writer specializing in network infrastructure documentation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again, or check your OpenAI API usage at platform.openai.com/usage');
      }
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate description.';
  } catch (error) {
    console.error('Error generating AI description:', error);
    throw error;
  }
}