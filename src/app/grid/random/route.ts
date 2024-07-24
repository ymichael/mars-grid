import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const randomNumber = Math.floor(Math.random() * 1000);
  const url = new URL(request.url);
  const queryParams = url.searchParams.toString();
  const redirectUrl = queryParams
    ? `/grid/${randomNumber}?${queryParams}`
    : `/grid/${randomNumber}`;
  return redirect(redirectUrl);
}
