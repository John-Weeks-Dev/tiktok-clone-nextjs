import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { SiSoundcharts } from "react-icons/si"
import { BiErrorCircle } from "react-icons/bi"
import { useEffect } from "react"
import Link from "next/link"
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"
import { PostUserCompTypes } from "@/app/types"

export default function PostUser({ post }: PostUserCompTypes) {

    useEffect(() => {
        const video = document.getElementById(`video${post?.id}`) as HTMLVideoElement

        setTimeout(() => {
            video.addEventListener('mouseenter', () => { video.play() })
            video.addEventListener('mouseleave', () => { video.pause() })
        }, 50)

    }, [])

    return (
        <>
            <div className="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
               {!post.video_url ? (
                    <div className="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
                        <AiOutlineLoading3Quarters className="animate-spin ml-1" size="80" color="#FFFFFF" />
                    </div>
                ) : (
                    <Link href={`/post/${post.id}/${post.user_id}`}>
                        <video 
                            id={`video${post.id}`}
                            muted
                            loop
                            className="aspect-[3/4] object-cover rounded-md" 
                            src={useCreateBucketUrl(post.video_url)}
                        />
                    </Link>
                )}
                <div className="px-1">
                    <p className="text-gray-700 text-[15px] pt-1 break-words">
                        {post.text}
                    </p>
                    <div className="flex items-center gap-1 -ml-1 text-gray-600 font-bold text-xs">
                        <SiSoundcharts size="15"/>
                        3%
                        <BiErrorCircle  size="16"/>
                    </div>
                </div>
            </div>
        </>
    )
}
