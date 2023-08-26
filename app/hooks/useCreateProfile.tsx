import { database, ID } from "@/libs/AppWriteClient"

const useCreateProfile = async (userId: string, name: string, image: string, bio: string) => {
    try {
        await database.createDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID), 
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_PROFILE),
            ID.unique(), 
        {
            user_id: userId,
            name: name,
            image: image,
            bio: bio,
        });
    } catch (error) {
        throw error
    }
}

export default useCreateProfile