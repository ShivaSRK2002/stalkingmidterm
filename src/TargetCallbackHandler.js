import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decryptToken } from './authUtils';
const TargetCallbackHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Extract the JWT token from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const idToken = hashParams.get('id_token'); // Get the ID token (JWT)
        console.log(idToken);

        if (idToken) {
            // Store the encrypted token in a secure cookie
            sessionStorage.setItem("jwt", idToken);

            const token = decryptToken(idToken);

            const payload = JSON.parse(atob(token.split('.')[1]));

            sessionStorage.setItem("userName", payload.sub);
            
            // Clear the URL hash to remove the token from the URL
            window.history.replaceState(null, null, window.location.pathname);

            // Redirect to the main page of the target application
            navigate('/HomePage');
        } else {
            console.error('Error: Invalid token format or no token found in URL');
        }
    }, [navigate]);

    return <div>Redirecting...</div>;
};

export default TargetCallbackHandler;
