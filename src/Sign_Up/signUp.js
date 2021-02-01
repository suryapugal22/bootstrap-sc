const formData = new FormData();
// const form = document.querySelector("form")
// const firstName = form.querySelector("input#firstName").value
// const lastName = form.querySelector("input#lastName").value
// const email = form.querySelector("input#email").value


function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

    const firstName = profile.getGivenName()
    const lastName = profile.getFamilyName()
    const email = profile.getEmail();

    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("email", email)

    console.log(formData.get('email'));
}


function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}