export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    // If Anthropic returned an error, pass it through clearly
    if (!response.ok) {
      return res.status(200).json({ 
        proxyError: true,
        status: response.status,
        anthropicError: data 
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(200).json({ proxyError: true, message: err.message });
  }
}
