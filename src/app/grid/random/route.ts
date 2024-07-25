import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const randomNumber = Math.floor(Math.random() * 1000);
  return redirect(`/grid/${randomNumber}`);
}
