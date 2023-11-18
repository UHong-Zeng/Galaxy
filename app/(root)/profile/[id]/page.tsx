import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import Map from "../../../../components/map";
import UpdateLocation from "@/components/forms/UpdateLocation";
import GPSPrivacy from "@/components/forms/GPSPrivacy";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();

  if (!user) {
    console.log("Can't find user");
    return null;
  }

  const userInfo = await fetchUser(params.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p
                    className="
                    ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2"
                  >
                    {userInfo?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value}>
              {tab.value === "threads" && (
                <ThreadsTab
                  currentUserId={user.id}
                  accountId={userInfo.id}
                  accountType="User"
                />
              )}
              {tab.value === "replies" && (
                <div className="text-light-1">Reply</div>
              )}
              {tab.value === "tagged" && (
                <div className="text-light-1">
                  <div className="flex flex-row">
                    <div className="flex-1">
                      <GPSPrivacy userId={userInfo.id}/>
                    </div>
                    <div className="flex-1">
                      <UpdateLocation userId={userInfo.id} />
                    </div>
                  </div>
                  <Map userId={userInfo.id} />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
