import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/grid/random?source=home");
  return null;
}
