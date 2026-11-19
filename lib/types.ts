export type UserRole = "freelancer" | "client" | "admin";

export type JobStatus = "open" | "in_progress" | "submitted" | "completed" | "cancelled";

export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  region: string | null;
  bio: string | null;
  skills: string[];
  languages: string[];
  weekly_hours: number | null;
  flexible_only: boolean;
  portfolio_links: string[];
  verified: boolean;
  created_at: string;
  is_demo?: boolean;
}

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget_uzs: number | null;
  estimated_hours: number | null;
  is_micro: boolean;
  flexible_deadline: boolean;
  deadline: string | null;
  status: JobStatus;
  assigned_to: string | null;
  client_paid: boolean;
  freelancer_received: boolean;
  hidden: boolean;
  created_at: string;
  is_demo?: boolean;
  client?: Pick<Profile, "id" | "full_name" | "region" | "verified">;
}

export interface Application {
  id: string;
  job_id: string;
  freelancer_id: string;
  message: string;
  price_uzs: number | null;
  status: ApplicationStatus;
  created_at: string;
  freelancer?: Profile;
  job?: Job;
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Pick<Profile, "id" | "full_name" | "verified">;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: "job" | "profile";
  target_id: string;
  reason: string;
  created_at: string;
  reporter?: Pick<Profile, "id" | "full_name">;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender?: Pick<Profile, "id" | "full_name">;
}
