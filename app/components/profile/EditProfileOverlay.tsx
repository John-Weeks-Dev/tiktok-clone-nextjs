import { useEffect, useState } from "react"
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'
import TextInput from "../TextInput";
import { BsPencil } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";
import { BiLoaderCircle } from "react-icons/bi";
import { CropperDimensions, ShowErrorObject } from "@/app/types";
import { useProfileStore } from "@/app/stores/profile";
import { useGeneralStore } from "@/app/stores/general";
import useUpdateProfile from "@/app/hooks/useUpdateProfile";
import useChangeUserImage from "@/app/hooks/useChangeUserImage";
import useUpdateProfileImage from "@/app/hooks/useUpdateProfileImage";
import useCreateBucketUrl from "@/app/hooks/useCreateBucketUrl";
 
export default function EditProfileOverlay() {
    
    let { currentProfile, setCurrentProfile } = useProfileStore()
    let { setIsEditProfileOpen } = useGeneralStore()

    const contextUser = useUser()
    const router = useRouter()

    const [file, setFile] = useState<File | null>(null);
    const [cropper, setCropper] = useState<CropperDimensions | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | ''>('');
    const [userName, setUserName] = useState<string | ''>('');
    const [userBio, setUserBio] = useState<string | ''>('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<ShowErrorObject | null>(null)

    useEffect(() => {
        setUserName(currentProfile?.name || '')
        setUserBio(currentProfile?.bio || '')
        setUserImage(currentProfile?.image || '')
    }, [])

    const getUploadedImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        
        if (selectedFile) {
            setFile(selectedFile);
            setUploadedImage(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setUploadedImage(null);
        }
    }

    const updateUserInfo = async () => {
        let isError = validate()
        if (isError) return
        if (!contextUser?.user) return
        
        try {
            setIsUpdating(true)
            await useUpdateProfile(currentProfile?.id || '', userName, userBio)
            setCurrentProfile(contextUser?.user?.id)
            setIsEditProfileOpen(false)
            router.refresh()
            
        } catch (error) {
            console.log(error)
        }
    }

    const cropAndUpdateImage = async () => {
        let isError = validate()
        if (isError) return
        if (!contextUser?.user) return

        try {
            if (!file) return alert('You have no file')
            if (!cropper) return alert('You have no file')
            setIsUpdating(true)

            const newImageId = await useChangeUserImage(file, cropper, userImage)
            await useUpdateProfileImage(currentProfile?.id || '', newImageId)

            await contextUser.checkUser()
            setCurrentProfile(contextUser?.user?.id)
            setIsEditProfileOpen(false)
            setIsUpdating(false)
        } catch (error) {
            console.log(error)
            setIsUpdating(false)
            alert(error)
        }
    }

    const showError = (type: string) => {
        if (error && Object.entries(error).length > 0 && error?.type == type) {
            return error.message
        }
        return ''
    }

    const validate = () => {
        setError(null)
        let isError = false

        if (!userName) {
            setError({ type: 'userName', message: 'A Username is required'})
            isError = true
        } 
        return isError
    }

    return (
        <>
            <div 
                id="EditProfileOverlay" 
                className="fixed flex justify-center pt-14 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto"
            >
                <div 
                    className={`
                        relative bg-white w-full max-w-[700px] sm:h-[580px] h-[655px] mx-3 p-4 rounded-lg mb-10
                        ${!uploadedImage ? 'h-[655px]' : 'h-[580px]'}
                    `}
                >
                    <div className="absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray-300">
                        <h1 className="text-[22px] font-medium">
                            Edit profile
                        </h1>
                        <button 
                            disabled={isUpdating} 
                            onClick={() => setIsEditProfileOpen(false)} 
                            className="hover:bg-gray-200 p-1 rounded-full"
                        >
                            <AiOutlineClose size="25"/>
                        </button>
                    </div>

                    <div className={`h-[calc(500px-200px)] ${!uploadedImage ? 'mt-16' : 'mt-[58px]'}`}>

                        {!uploadedImage ? ( 
                            <div>
                                <div 
                                    id="ProfilePhotoSection" 
                                    className="flex flex-col border-b sm:h-[118px] h-[145px] px-1.5 py-2 w-full"
                                >
                                    <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                                        Profile photo
                                    </h3>

                                    <div className="flex items-center justify-center sm:-mt-6">
                                        <label htmlFor="image" className="relative cursor-pointer">

                                            <img className="rounded-full" width="95" src={useCreateBucketUrl(userImage)} />

                                            <button className="absolute bottom-0 right-0 rounded-full bg-white shadow-xl border p-1 border-gray-300 inline-block w-[32px] h-[32px]">
                                                <BsPencil size="17" className="ml-0.5"/>
                                            </button>
                                        </label>
                                        <input
                                            className="hidden"
                                            type="file"
                                            id="image"
                                            onChange={getUploadedImage}
                                            accept="image/png, image/jpeg, image/jpg"
                                        />
                                    </div>
                                </div>

                                <div 
                                    id="UserNameSection" 
                                    className="flex flex-col border-b sm:h-[118px]  px-1.5 py-2 mt-1.5  w-full"
                                >
                                    <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                                        Name
                                    </h3>

                                    <div className="flex items-center justify-center sm:-mt-6">
                                        <div className="sm:w-[60%] w-full max-w-md">

                                            <TextInput 
                                                string={userName}
                                                placeholder="Username"
                                                onUpdate={setUserName}
                                                inputType="text"
                                                error={showError('userName')}
                                            />
                                            
                                            <p className={`relative text-[11px] text-gray-500 ${error ? 'mt-1' : 'mt-4'}`}>
                                                Usernames can only contain letters, numbers, underscores, and periods. 
                                                Changing your username will also change your profile link.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div 
                                    id="UserBioSection" 
                                    className="flex flex-col sm:h-[120px]  px-1.5 py-2 mt-2 w-full"
                                >
                                    <h3 className="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                                        Bio
                                    </h3>

                                    <div className="flex items-center justify-center sm:-mt-6">
                                        <div className="sm:w-[60%] w-full max-w-md">
                                            <textarea 
                                                cols={30}
                                                rows={4}
                                                onChange={e => setUserBio(e.target.value)}
                                                value={userBio || ''}
                                                maxLength={80}
                                                className="
                                                    resize-none
                                                    w-full
                                                    bg-[#F1F1F2]
                                                    text-gray-800
                                                    border
                                                    border-gray-300
                                                    rounded-md
                                                    py-2.5
                                                    px-3
                                                    focus:outline-none
                                                "
                                            ></textarea>
                                            <p className="text-[11px] text-gray-500">{userBio ? userBio.length : 0}/80</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-h-[420px] mx-auto bg-black circle-stencil">
                                <Cropper
                                    stencilProps={{ aspectRatio: 1 }}
                                    className="h-[400px]"
                                    onChange={(cropper) => setCropper(cropper.getCoordinates())}
                                    src={uploadedImage}
                                />
                            </div>
                        )}
                        
                    </div>
                    

                    <div 
                        id="ButtonSection" 
                        className="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 w-full"
                    >
                        {!uploadedImage ? (
                            <div id="UpdateInfoButtons" className="flex items-center justify-end">

                                <button 
                                    disabled={isUpdating}
                                    onClick={() => setIsEditProfileOpen(false)}
                                    className="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
                                >
                                    <span className="px-2 font-medium text-[15px]">Cancel</span>
                                </button>

                                <button 
                                    disabled={isUpdating}
                                    onClick={() => updateUserInfo()}
                                    className="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
                                >
                                    <span className="mx-4 font-medium text-[15px]">
                                        {isUpdating ? <BiLoaderCircle color="#ffffff" className="my-1 mx-2.5 animate-spin" /> : "Save" }
                                    </span>
                                </button>

                            </div>
                        ) : (
                            <div id="CropperButtons" className="flex items-center justify-end" >

                                <button 
                                    onClick={() => setUploadedImage(null)}
                                    className="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
                                >
                                    <span className="px-2 font-medium text-[15px]">Cancel</span>
                                </button>

                                <button 
                                    onClick={() => cropAndUpdateImage()}
                                    className="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
                                >
                                    <span className="mx-4 font-medium text-[15px]">
                                        {isUpdating ? <BiLoaderCircle color="#ffffff" className="my-1 mx-2.5 animate-spin" /> : "Apply" }
                                    </span>
                                </button>

                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </>
    )
}
