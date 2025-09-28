// fe/src/components/DebugAuth/DebugAuth.tsx

import React from 'react';
import { useAuth } from '../../context/authContext';

const DebugAuth: React.FC = () => {
    const { user, isAuthenticated, loading } = useAuth();
    
    return (
        <div style={{ position: 'fixed', top: '100px', right: '10px', background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
            <h4>Auth Debug:</h4>
            <p>Loading: {loading ? 'true' : 'false'}</p>
            <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
            <p>User: {JSON.stringify(user)}</p>
        </div>
    );
};

export default DebugAuth;