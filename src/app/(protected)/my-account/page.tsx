/* eslint-disable react-hooks/rules-of-hooks */
import { useUser } from "@/hooks/use-user";
import ProfileClientPage from './client';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { user } = await useUser();
  if(!user) redirect("/sign-in")
  return (
    <ProfileClientPage user={user} />
  );
};

export default Page;
