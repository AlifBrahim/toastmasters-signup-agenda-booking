import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

const Login = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (session) {
        router.push('/');
        return null;
    }
    return (
        <div>
            Not signed in <br />
            <Button variant="contained" color="primary" onClick={() => signIn()}>
                Sign in
            </Button>
        </div>
    );
};
export default Login;
