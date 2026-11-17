// Vercel Serverless Function: /api/recipes
// Proxies requests to Spoonacular while keeping the API key hidden.

export default async function handler(req, res) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing SPOONACULAR_API_KEY environment variable" });
    return;
  }

  // Expect a query string like ?query=pasta&number=10
  const { query, number = "10" } = req.query;
  if (!query) {
    res.status(400).json({ error: "Missing required 'query' parameter" });
    return;
  }

  const spoonUrl = new URL("https://api.spoonacular.com/recipes/complexSearch");
  spoonUrl.searchParams.append("query", query);
  spoonUrl.searchParams.append("number", number);
  spoonUrl.searchParams.append("apiKey", apiKey);

  try {
    const response = await fetch(spoonUrl.toString());
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      res.status(response.status).json({ error: err.message || "Spoonacular request failed" });
      return;
    }
    const data = await response.json();
    // Forward only the useful part to the client
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
