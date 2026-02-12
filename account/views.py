from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import make_password, check_password
from django.http import HttpResponse, JsonResponse   # JsonResponse added for AJAX
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings
from .models import Profile
from .forms import SignupForm, LoginForm
import random, time


# ================= HOME =================
@login_required
def home(request):
    return render(request, 'home.html')


# ================= SIGNUP =================
def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']

            if Profile.objects.filter(username=username).exists():
                return HttpResponse("Username already exists ❌")

            if Profile.objects.filter(email=email).exists():
                return HttpResponse("Email already exists ❌")

            Profile.objects.create(
                username=username,
                email=email,
                password=make_password(password)  # PASSWORD HASHING
            )

            return redirect('login')

    else:
        form = SignupForm()

    return render(request, 'signup.html', {'form': form})


# ================= LOGIN =================
def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        if form.is_valid():
            username_or_email = form.cleaned_data['username']
            password = form.cleaned_data['password']

            try:
                user = Profile.objects.get(
                    Q(username=username_or_email) |
                    Q(email=username_or_email)
                )

                if check_password(password, user.password):
                    return HttpResponse("Logged in successfully 👍")

                return HttpResponse("Invalid Username or Password ❌")

            except Profile.DoesNotExist:
                return HttpResponse("Invalid Username or Password ❌")

    else:
        form = LoginForm()

    return render(request, 'login.html', {'form': form})


# ================= FORGOT PASSWORD + SEND OTP =================
def forgot_password(request):

    if request.method == "POST":
        email = request.POST.get("email")
        user = Profile.objects.filter(email=email).first()

        if user:
            otp = str(random.randint(100000, 999999))

            # OLD OTP expire immediately
            request.session['otp'] = otp
            request.session['reset_email'] = email
            request.session['otp_time'] = int(time.time())

            send_mail(
                "Password Reset OTP",
                f"""
Hello {user.username},

Your OTP is: {otp}
Valid for 5 minutes.

If you didn't request this,
ignore this mail.

Thanks,
Support Team
""",
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return redirect('verify-otp')

    return render(request, "forgot_password.html")


# ================= RESEND OTP (NEW AJAX VIEW) =================
def resend_otp(request):
    """
    AJAX resend OTP without page reload.
    Called from verify_otp page.
    """

    email = request.session.get('reset_email')

    if not email:
        return JsonResponse({"status": "error"})

    user = Profile.objects.filter(email=email).first()

    if user:
        otp = str(random.randint(100000, 999999))

        # Replace old OTP immediately
        request.session['otp'] = otp
        request.session['otp_time'] = int(time.time())

        send_mail(
            "Password Reset OTP",
            f"Your new OTP is {otp}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "error"})


# ================= VERIFY OTP =================
def verify_otp(request):

    if request.method == "POST":
        otp = request.POST.get("otp")

        # OTP expiry check (5 minutes)
        if time.time() - request.session.get('otp_time', 0) > 300:
            return HttpResponse("OTP expired ❌ Please resend OTP")

        # Only latest OTP accepted
        if otp == request.session.get('otp'):
            return redirect('reset-password')

        return HttpResponse("Invalid OTP ❌")

    return render(request, "verify_otp.html")


# ================= RESET PASSWORD =================
def reset_password(request):

    if request.method == "POST":
        password = request.POST.get("password")
        email = request.session.get('reset_email')

        user = Profile.objects.get(email=email)
        user.password = make_password(password)
        user.save()

        # Clean session after success
        request.session.pop('otp', None)
        request.session.pop('otp_time', None)

        return HttpResponse("Password Reset Successful 👍")

    return render(request, "reset_password.html")
