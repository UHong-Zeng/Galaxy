"use client";

import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { getPrivacyState, togglePrivacy } from "@/lib/actions/userLocation.action";

const GPSPrivacy = ({userId}: {userId: string}) => {
  const [isPrivate, setIsPrivate] = useState(false); //false -> Public, true -> Private.

  useEffect(() => {
    const fetchPrivacyState = async () => {
      const privacyState = await getPrivacyState(userId);
      setIsPrivate(privacyState);
    }
    fetchPrivacyState();
  }, [isPrivate, userId])

  async function privacyChanger(checked: boolean) {
    setIsPrivate(checked);
    await togglePrivacy(userId, checked);
  } 

  return (
    <div className="text-primary-500 ">
      <div className="text-heading3-bold">GPS Privacy</div>
      
      <Switch className="" checked={isPrivate} onCheckedChange={privacyChanger}/>
      <p className="text-body-semibold">{isPrivate? "Private" : "Public"}</p>
    </div>
  );
};

export default GPSPrivacy;
