import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user){
    console.log("Can't find user");
    return null;
  };

  console.log(`user.id: ${user.id}`)
  const userInfo = await fetchUser(user.id);
  console.log(userInfo?.username);

  console.log();
  
  console.log(userInfo?._id);
  
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Nebula</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
