import { useUser as useClerkUser, useClerk } from "@clerk/clerk-react";

export function useUser() {
    const { user, isLoaded, isSignedIn } = useClerkUser();
    const { signOut } = useClerk();

    return {
        user: user,
        isLoading: !isLoaded,
        error: null, // Clerk handles errors internally usually
        logout: () => signOut(),
        isLoaded,
        isSignedIn,
    };
}
