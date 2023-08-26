"use client"

import PostUser from "@/app/components/profile/PostUser"
import MainLayout from "@/app/layouts/MainLayout"
import { BsPencil } from "react-icons/bs"
import { useEffect } from "react"
import { useUser } from "@/app/context/user"
import ClientOnly from "@/app/components/ClientOnly"
import { ProfilePageTypes, User } from "@/app/types"
import { usePostStore } from "@/app/stores/post"
import { useProfileStore } from "@/app/stores/profile"
import { useGeneralStore } from "@/app/stores/general"
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl"

export default function Profile({ params }: ProfilePageTypes) {
    const contextUser = useUser()
    let { postsByUser, setPostsByUser } = usePostStore()
    let { setCurrentProfile, currentProfile } = useProfileStore()
    let { isEditProfileOpen, setIsEditProfileOpen } = useGeneralStore()

    useEffect(() => {
        setCurrentProfile(params?.id)
        setPostsByUser(params?.id)
    }, [])

    return (
        <>
            <MainLayout>
                <div className="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">

                    <div className="flex w-[calc(100vw-230px)]">

                        <ClientOnly>
                            {currentProfile ? (
                                <img className="w-[120px] min-w-[120px] rounded-full" src={useCreateBucketUrl(currentProfile?.image)} />
                            ) : (
                                <div className="min-w-[150px] h-[120px] bg-gray-200 rounded-full" />
                            )}
                        </ClientOnly>

                        <div className="ml-5 w-full">
                            <ClientOnly>
                                {(currentProfile as User)?.name ? (
                                    <div>
                                        <p className="text-[30px] font-bold truncate">{currentProfile?.name}</p>
                                        <p className="text-[18px] truncate">{currentProfile?.name}</p>
                                    </div>
                                ) : (
                                    <div className="h-[60px]" />
                                )}
                            </ClientOnly>

                            
                            {contextUser?.user?.id == params?.id ? (
                                <button 
                                    onClick={() => setIsEditProfileOpen(isEditProfileOpen = !isEditProfileOpen)}
                                    className="flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
                                >
                                    <BsPencil className="mt-0.5 mr-1" size="18"/>
                                    <span>Edit profile</span>
                                </button>
                            ) : (
                                <button className="flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
                                    Follow
                                </button>
                            )}
                        </div>

                    </div>

                    <div className="flex items-center pt-4">
                        <div className="mr-4">
                            <span className="font-bold">10K</span>
                            <span className="text-gray-500 font-light text-[15px] pl-1.5">Following</span>
                        </div>
                        <div className="mr-4">
                            <span className="font-bold">44K</span>
                            <span className="text-gray-500 font-light text-[15px] pl-1.5">Followers</span>
                        </div>
                    </div>

                    <ClientOnly>
                        <p className="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
                            {currentProfile?.bio}
                        </p>
                    </ClientOnly>

                    <ul className="w-full flex items-center pt-4 border-b">
                        <li className="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">Videos</li>
                        <li className="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">Liked</li>
                    </ul>

                    <ClientOnly>
                        <div className="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
                            {postsByUser?.map((post, index) => (
                                <PostUser key={index} post={post} />
                            ))}
                        </div>
                    </ClientOnly>

                    <div className="pb-20" />
                </div>
            </MainLayout>
        </>
    )
}
