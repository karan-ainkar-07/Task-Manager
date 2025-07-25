import authService from "./AppwriteUserAuth";

function OnSignUp(email,password, confirmPassword, errors,name) {
    if (password !== confirmPassword) {
        return "Password and Confirm Password don't match";
    }
    const hasAnyError = Object.values(errors).some(Boolean);

    if (hasAnyError) {
        return "Form should be filled completely and correctly";
    }

    return authService.signUp(email,password,name);
}

function OnLoginClick(email,password,errors)
{
    const hasAnyError = Object.values(errors).some(Boolean);
    if(hasAnyError)
    {
        return "Email is incorrect";
    }
    return authService.signIn(email,password);

}
export  {OnSignUp,OnLoginClick};