declare global{
    namespace NodeJS{
        interface ProcessEnv{
            MASTER_SALT:string
        }
    }
    interface Window {
        api: {
            getAll: () => void;
            getPasswords: (criteria) => void;
            createPassword: (password) => void;
            updatePassword: (criteria, newPass) => void;
            deletePassword: (criteria) => void;
            deletePlatform: (criteria) => void;
        };
        auth: {
            login:(username:string,password:string)=>void,
            register:(username:string,password:string)=>void,
            needAccount:()=>void,
            haveAccount:()=>void,
            forgetPass:()=>void,
        };
    }
}

export {}