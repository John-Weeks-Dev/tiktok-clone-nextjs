import { database, storage, ID } from "@/libs/AppWriteClient"

const useCreatePost = async (file: File, userId: string, caption: string) => {
    let videoId = Math.random().toString(36).slice(2, 22)

    try {
        await database.createDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID), 
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_POST), 
            ID.unique(), 
        {
            user_id: userId,
            text: caption,
            video_url: videoId,
            created_at: new Date().toISOString(),
        });
        await storage.createFile(String(process.env.NEXT_PUBLIC_BUCKET_ID), videoId, file)
    } catch (error) {
        throw error
    }
}

export default useCreatePost