import { Client,Account,ID ,Databases} from "appwrite";

class AuthService
{
    client=new Client();
    account;
    constructor(){
        this.client
        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT);
        this.account=new Account(this.client);
    }

    // Create a new account with email & password
    async signUp(email, password, name) {
      try {
        await this.account.create(ID.unique(), email, password, name);
        await this.signIn(email,password);
        return "Account Created Successfully";
      } catch (error) {
        return error.message;
      }
    }

    // Login with email & password
    async signIn(email, password) {
      try {
        await this.account.createEmailSession(email, password); 
        return "Login Successfull"
      } catch (error) {
        console.log(error);
        return "Email or Password are incorrect";
      }
    }

    // Get currently logged-in user
    async getCurrentUser() {
      try {
        return await this.account.get();
      } catch (error) {
        return null; 
      }
    }

    // Logout current session
    async signOut() {
      try {
        return await this.account.deleteSession("current");
      } catch (error) {
        throw error;
      }
    }
}
const authService= new AuthService();
export default authService;