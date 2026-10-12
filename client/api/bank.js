import { handleBank } from "./bankHandler.js";

export default function handler(req, res) {
  return handleBank(req, res);
}
