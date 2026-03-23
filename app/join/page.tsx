import { redirect } from 'next/navigation';

/** Legacy path from the waitlist era — homepage now drives onboarding. */
export default function JoinPage() {
  redirect('/');
}
