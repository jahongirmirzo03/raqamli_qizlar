import { notFound } from "next/navigation";
import { createServerSupabase, getCurrentProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_PROFILES, DEMO_REVIEWS } from "@/lib/demo-data";
import { ProfileView } from "@/components/ProfileView";
import type { Profile, Review } from "@/lib/types";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentProfile();

  let profile: Profile | null = null;
  let reviews: Review[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data: dbProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (dbProfile) {
      profile = dbProfile as Profile;
      const { data: dbReviews } = await supabase
        .from("reviews")
        .select("*, reviewer:profiles!reviews_reviewer_id_fkey(id, full_name, verified)")
        .eq("reviewee_id", id)
        .order("created_at", { ascending: false });
      reviews = (dbReviews as unknown as Review[]) ?? [];
    }
  }

  // Agar bazadan topilmasa, demo profillardan qidiramiz
  if (!profile) {
    const demo = DEMO_PROFILES.find((p) => p.id === id);
    if (demo) {
      profile = demo;
      reviews = DEMO_REVIEWS.filter((r) => r.reviewee_id === id);
    }
  }

  if (!profile) {
    notFound();
  }

  return (
    <ProfileView
      profile={profile}
      reviews={reviews}
      isOwner={currentUser?.id === profile.id}
    />
  );
}
