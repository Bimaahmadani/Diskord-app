import { clerkClient } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

export async function POST(request: Request) {
    const apiKey = process.env.STREAM_API_KEY!;
    if (!apiKey) {
        return Response.error();
    }

    const serverCLient = StreamChat.getInstance(
        apiKey,
        process.env.STREAM_SECRET
    );

    const body = await request.json();
    console.log(`[api/register-user] Body:`, body);

    const userId = body?.userId;
    const mail = body?.email;

    if (!userId || !mail) {
        return Response.error();
    }

    const user = await serverCLient.upsertUser({
        id: userId,
        role: 'user',
        name: mail,
        image: `https://getstream.io/random_png/?id=${userId}&name=${mail}`,
    });

    const params={
        publicMetadata: {
            streamRegistered: true,
        },
    };

    
    const clerk = await clerkClient();
    const updatedUser = await clerk.users.updateUser(userId, params);

    console.log(`[api/register-user] User :`, updatedUser);
    const response={
        userId: userId,
        userName: mail,
    }
    return Response.json(response);
}
