function CorrectUsername(username)
{
    if (username.length < 3 || username.length > 20) {
        return false;
    }

    const regex = /^[a-zA-Z0-9_@]+$/;
    return regex.test(username);
}
function ValidateName(Name)
{
    const regex=/^[a-zA-Z ]+$/;
    var isValid=true;
    var errorMessage=" ";
    if(Name.length===0)
    {
        errorMessage="Name cannot be empty.";
        isValid=false;
    }
    else{
        isValid= regex.test(Name);
        errorMessage="Name can only contain alphabets."
    }
    return {isValid,errorMessage};
}
function ValidateEmail(email) {
    let isValid = true;
    let errorMessage = "";

    if (email.length === 0) {
        isValid = false;
        errorMessage = "Email cannot be empty.";
    } else if (!email.includes("@")) {
        isValid = false;
        errorMessage = "Email must contain '@' symbol.";
    } else {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            isValid = false;
            errorMessage = "Please enter a valid email address.";
        }
    }

    return { isValid, errorMessage };
}
function ValidatePassword(pass)
{
    var isValid=true;
    var errorMessage="";
    if(pass.length<8)
    {
        isValid=false;
        errorMessage="Password Length cannot be less than 8";
    }
    return {isValid,errorMessage};
}
export { CorrectUsername,  ValidateName ,ValidateEmail ,ValidatePassword};