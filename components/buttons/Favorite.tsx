"use client";

import { isLikePost, toggleLike } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useEffect, useState } from "react";

const Favorite = ({ userId, postId }: { userId: string; postId: string }) => {
  const [isLike, setIsLike] = useState<boolean>();

  useEffect(() => {
    async function fetchIsLike() {
      try {
        const result = await isLikePost(userId, postId);
        if(result == null) setIsLike(false)
        else setIsLike(result);
        // console.log("result: ", result);
        
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
    fetchIsLike();
  }, []);
  
  const handleClick = async () => {
    let currentLike = await toggleLike(userId, postId, Boolean(isLike));
    setIsLike(currentLike);
    // console.log(isLike);
  };

  return (
    <>
      <button onClick={handleClick}>
        {isLike ? (
          <Image
            src="/assets/heart-filled.svg"
            alt="heart"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        ) : (
          <Image
            src="/assets/heart-gray.svg"
            alt="heart"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        )}
      </button>
    </>
  );
};

export default Favorite;
