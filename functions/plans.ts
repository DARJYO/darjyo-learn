export const onRequestGet: PagesFunction = async ({ env }) => {
  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "https://graph.microsoft.com/.default"
      })
    }
  );

  const tokenData = await tokenResponse.json();

  const catalogResponse = await fetch(
    "https://graph.microsoft.com/v1.0/learningProvider/learningContents?$filter=contains(tags,'DARJYO')",
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    }
  );

  const catalog = await catalogResponse.json();

  return new Response(JSON.stringify(catalog.value), {
    headers: { "Content-Type": "application/json" }
  });
};
