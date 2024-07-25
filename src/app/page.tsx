import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/grid/random");
  return null;
}
