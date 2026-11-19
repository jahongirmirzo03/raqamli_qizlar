import { redirect } from "next/navigation";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileView } from "@/components/ProfileView";
import type { Review } from "@/lib/types";

export default async function MyProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login?next=/profile");
  }

  let reviews: Review[] = [];
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data } = await supabase
      .from("reviews")
      .select("*, reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, verified)")
      .eq("reviewee_id", profile.id)
      .order("created_at", { ascending: false });
    reviews = (data as unknown as Review[]) ?? [];
  }

  return <ProfileView profile={profile} reviews={reviews} isOwner={true} />;
}
