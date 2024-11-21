import PsiogEncryption from 'psiog-crypt';

const encryptionKey = 'process.env.REACT_APP_ENCRYPTION_KEY';
const psiog = new PsiogEncryption(encryptionKey);

export function encryptToken(token) {
    if (!encryptionKey) {
        throw new Error("Encryption key is not defined.");
    }

    try {
        return psiog.encrypt(token);
    } catch (error) {
        console.error("Encryption failed:", error);
        throw error;
    }
}

export function decryptToken(encryptedToken) {
    try {

        return psiog.decrypt(encryptedToken);
    } catch (error) {
        console.error("Decryption failed:", error.message);
        throw new Error("Failed to decrypt token: Check if the token is encrypted and the key is correct.");
    }
}

export function checkAuthorization() {
    const encryptedToken = sessionStorage.getItem("jwt");

    if (!encryptedToken) {
        console.warn('No JWT token found in session.');
        return false;
    }

    try {
        const token = decryptToken(encryptedToken);
        console.log("decrypted" , token);

        if (isTokenExpired(token)) {
            console.warn('Unauthorized access - tokens do not match or token has expired');
            return false;
        }
        return true;
    } catch (error) {
        console.error("Authorization check failed:", error);
        return false;
    }
}

function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("payload ", payload);
        const expiration = payload.exp * 1000;
        return Date.now() > expiration;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

// Logout function to clear tokens and redirect
export function logout() {
    sessionStorage.clear(); 
    window.location.href = 'https://digipo.auth.us-west-2.amazoncognito.com/logout?client_id=2mnv17voa7e8q6banlg0j0qth&logout_uri=https://main.d11ggxyoy8k64j.amplifyapp.com/'; // Replace with your actual sign-out URL
}
