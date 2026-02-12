// Show / Hide Password function
function togglePassword(id) {
    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


// Simple form validation
document.addEventListener("submit", function (e) {
    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        if (input.value.trim() === "") {
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
document.addEventListener("DOMContentLoaded", function () {

    let timeLeft = 60;
    let resendBtn = document.getElementById("resendBtn");

    if (!resendBtn) return;

    resendBtn.classList.remove("active");
    resendBtn.style.pointerEvents = "none";

    let countdown;

    function startTimer() {
        if (countdown) clearInterval(countdown);

        console.log("Timer started");
        timeLeft = 60;
        resendBtn.innerHTML = "Resend OTP (" + timeLeft + "s)";
        resendBtn.classList.remove("active");
        resendBtn.style.pointerEvents = "none";

        countdown = setInterval(() => {
            timeLeft--;
            resendBtn.innerHTML = "Resend OTP (" + timeLeft + "s)";
            console.log("Timer tick:", timeLeft);

            if (timeLeft <= 0) {
                clearInterval(countdown);
                resendBtn.innerHTML = "Resend OTP";
                resendBtn.classList.add("active");
                resendBtn.style.pointerEvents = "auto";
            }
        }, 1000);
    }



    startTimer();

    resendBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const url = this.getAttribute("data-url");

        if (!url) return;

        // Disable button immediately to prevent double clicks
        resendBtn.style.pointerEvents = "none";
        resendBtn.innerHTML = "Sending...";

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("OTP Resent Successfully! 📩");
                    startTimer();
                } else {
                    alert("Error resending OTP! ❌");
                    // Re-enable button on error so they can try again
                    resendBtn.innerHTML = "Resend OTP";
                    resendBtn.style.pointerEvents = "auto";
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Something went wrong! ❌");
                resendBtn.innerHTML = "Resend OTP";
                resendBtn.style.pointerEvents = "auto";
            });
    });

});
