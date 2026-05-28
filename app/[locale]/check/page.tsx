import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export default async function CheckPage() {
  const locale = await getLocale();
  redirect(`/${locale}/check/0`);
}
