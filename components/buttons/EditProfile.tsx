'use client';

import { changeOnboarded } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const EditProfile = ({userId}: {userId: string}) => {
  
  const handleClick = async () => {
    console.log(userId);
    await changeOnboarded(userId);
    // redirect("/onboarding");
  }

  return (
    <div>
      <Link onClick={handleClick} href="/onboarding" >
        <Image
          src="/assets/edit.svg"
          alt="Edit Profile"
          width={26}
          height={26}
          className="cursor-pointer "
        />
      </Link>
    </div>
  );
};

export default EditProfile;
