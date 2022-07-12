import { NextApiHandler } from "next";
import { BACKEND_BASE } from "../../constants";

const handler: NextApiHandler = async (req, res) => {
  const body = JSON.parse(req.body);

  if (req.method !== "POST") return;

  const response = await fetch(
    `${BACKEND_BASE}/v1/models/digit-recognition:predict`,
    {
      method: "POST",
      body: JSON.stringify({
        inputs: body,
      }),
    }
  );

  const jsonResponse = await response.json();
  const dist = jsonResponse.outputs as number[][];

  res.json({
    dist,
  });
  res.end();
};

export default handler;
