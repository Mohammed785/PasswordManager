interface Window {
    api: {
        getAll: () => void;
        getPasswords: (criteria) => void;
        createPassword: (password) => void;
        updatePassword: (criteria, newPass) => void;
        deletePassword: (criteria) => void;
        deletePlatform:(criteria)=>void;
    };
}
