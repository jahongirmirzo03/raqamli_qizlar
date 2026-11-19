import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export default async function ProfileEditPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/profile/edit");
  }

  return <ProfileEditForm profile={profile} />;
}
