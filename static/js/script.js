// Show / Hide Password function
function togglePassword(id){
    const input = document.getElementById(id);

    if(input.type === "password"){
        input.type = "text";
    } else {
        input.type = "password";
    }
}


// Simple form validation
document.addEventListener("submit", function(e){
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        if(input.value.trim() === ""){
            alert("Please fill all fields");
            e.preventDefault();
        }
    });
});


// Eye icon auto add beside password field
document.addEventListener("DOMContentLoaded", function () {

    const passwordInput = document.querySelector("input[type='password']");

    if (passwordInput) {

        // Wrapper div
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";

        passwordInput.parentNode.insertBefore(wrapper, passwordInput);
        wrapper.appendChild(passwordInput);

        // Eye icon
        const eyeBtn = document.createElement("span");
        eyeBtn.innerHTML = "👁";
        eyeBtn.style.position = "absolute";
        eyeBtn.style.right = "12px";
        eyeBtn.style.top = "50%";
        eyeBtn.style.transform = "translateY(-50%)";
        eyeBtn.style.cursor = "pointer";
        eyeBtn.style.fontSize = "18px";

        wrapper.appendChild(eyeBtn);

        eyeBtn.onclick = function () {
            passwordInput.type =
                passwordInput.type === "password" ? "text" : "password";
        };
    }
});

document.addEventListener("DOMContentLoaded", function () {

    const usernameInput = document.querySelector("input[name='username']");
    const helpText = document.querySelector(".helptext");

    if (usernameInput && helpText) {

        // initially hide
        helpText.style.display = "none";

        usernameInput.addEventListener("input", function () {
            helpText.style.display = this.value.trim() ? "block" : "none";
        });
    }

});


// OTP RESEND TIMER
document.addEventListener("DOMContentLoaded", function(){

    let timeLeft = 60;
    let timer = document.getElementById("timer");
    let resendBtn = document.getElementById("resendBtn");

    if(!timer || !resendBtn) return;

    resendBtn.classList.remove("active");
    resendBtn.style.pointerEvents = "none";

    timer.innerHTML = "(60s)";

    let countdown = setInterval(() => {

        timeLeft--;
        timer.innerHTML = "(" + timeLeft + "s)";

        if(timeLeft <= 0){
            clearInterval(countdown);
            timer.innerHTML = "";
            resendBtn.classList.add("active");
            resendBtn.style.pointerEvents = "auto";
        }

    }, 1000);

});
