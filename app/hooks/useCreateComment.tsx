import { database, ID } from "@/libs/AppWriteClient"

const useCreateComment = async (userId: string, postId: string, comment: string) => {
    try {
        await database.createDocument(
            String(process.env.NEXT_PUBLIC_DATABASE_ID), 
            String(process.env.NEXT_PUBLIC_COLLECTION_ID_COMMENT), 
            ID.unique(), 
        {
            user_id: userId,
            post_id: postId,
            text: comment,
            created_at: new Date().toISOString(),
        });
    } catch (error) {
        throw error
    }
}

export default useCreateComment