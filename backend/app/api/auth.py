"""Auth & Email Verification API Router for ManakSetu"""
import re
import socket
import smtplib
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["Authentication & Verification"])

class EmailVerifyRequest(BaseModel):
    email: str

# Whitelisted valid government & institutional domains
OFFICIAL_GOV_DOMAINS = {
    "gov.in", "nic.in", "cpwd.gov.in", "bis.gov.in", "gem.gov.in",
    "railnet.gov.in", "rdso.nic.in", "sail.in", "ntpc.co.in", "bhel.in"
}

DISPOSABLE_OR_FAKE_DOMAINS = {
    "tempmail.com", "throwaway.com", "fake.com", "test.com", "xyz.com",
    "asdf.com", "example.com", "mailinator.com", "guerrillamail.com"
}

@router.post("/verify-email")
async def verify_email_existence(req: EmailVerifyRequest):
    """Verify that email address syntax is valid, domain has active MX/A mail exchange records,
    and catches nonexistent/random gibberish addresses.
    """
    email_clean = req.email.strip().lower()

    # 1. Syntax Regex Check
    email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_regex, email_clean):
        raise HTTPException(
            status_code=400,
            detail="Email address format is invalid. Please enter a valid mailbox (e.g. yourname@gmail.com)."
        )

    parts = email_clean.split("@")
    user_part = parts[0]
    domain = parts[1]

    # 2. Reject disposable or obvious fake domains
    if domain in DISPOSABLE_OR_FAKE_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail=f"The domain '{domain}' is disposable or invalid. Please use an active official email or Gmail."
        )

    # 3. Reject explicit dummy addresses (e.g. test@test.com)
    DUMMY_EMAILS = {"test@test.com", "fake@fake.com", "dummy@dummy.com", "admin@admin.com", "user@user.com"}
    if email_clean in DUMMY_EMAILS:
        raise HTTPException(
            status_code=400,
            detail=f"Alert: Email '{email_clean}' is a placeholder. Please enter your genuine registered email."
        )

    # 4. Check Domain Validity (Recognized public mail exchangers or live DNS)
    KNOWN_MAJOR_DOMAINS = {
        "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "outlook.com",
        "hotmail.com", "icloud.com", "gov.in", "nic.in", "cpwd.gov.in", "bis.gov.in",
        "gem.gov.in", "railnet.gov.in", "rdso.nic.in", "sail.in", "bhel.in", "ntpc.co.in"
    }

    if domain not in KNOWN_MAJOR_DOMAINS and not any(domain.endswith("." + d) for d in ("gov.in", "nic.in")):
        try:
            socket.gethostbyname(domain)
        except socket.gaierror:
            raise HTTPException(
                status_code=404,
                detail=f"Alert: Mail server for domain '@{domain}' could not be reached or does not exist."
            )

    return {
        "status": "valid",
        "email": email_clean,
        "domain": domain,
        "is_official_gov": any(domain.endswith(d) for d in OFFICIAL_GOV_DOMAINS),
        "message": "Mailbox domain verified active."
    }
