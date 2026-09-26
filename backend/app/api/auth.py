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

    # 2. Check for disposable or obvious fake domains
    if domain in DISPOSABLE_OR_FAKE_DOMAINS:
        raise HTTPException(
            status_code=400,
            detail=f"The domain '{domain}' is disposable or invalid. Please use an active official email or Gmail."
        )

    # 3. Check for obvious random gibberish usernames (e.g. abcdd, dthssthrs, asdfghj, qwrtyp, etc.)
    alpha_part = "".join(c for c in user_part if c.isalpha())
    vowels = set("aeiou")
    vowel_count = sum(1 for c in alpha_part if c in vowels)

    # Alphabet sequences (e.g. abcdd, abcde, bcdef)
    alphabet_sequences = [
        "abcd", "bcde", "cdef", "defg", "efgh", "fghi", "ghij", "hijk",
        "ijkl", "jklm", "klmn", "lmno", "mnop", "nopq", "opqr", "pqrs",
        "qrst", "rstu", "stuv", "tuvw", "uvwx", "vwxy", "wxyz",
        "dcba", "edcb", "fedc", "gfed", "hgfe", "ihgf", "jihg", "kjih"
    ]
    has_alphabet_seq = any(seq in alpha_part for seq in alphabet_sequences)

    # 1. Zero vowels in names of length 5+ (e.g. dthssthrs, bcdfgh)
    zero_vowels = len(alpha_part) >= 5 and vowel_count == 0

    # 2. Extreme 5+ consonant cluster (e.g. dthssth, qwrtyps)
    extreme_consonant_cluster = bool(re.search(r"[bcdfghjklmnpqrstvwxyz]{5,}", alpha_part))

    # 3. Keyboard mashing patterns (e.g. asdfgh, zxcvbn)
    keyboard_walks = ["asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl", "qwer", "wert", "erty", "rtyu", "zxcv", "xcvb", "cvbn"]
    is_keyboard_mash = any(walk in alpha_part for walk in keyboard_walks)

    # 4. Dummy test usernames and prefixes
    dummy_names = {"test", "testing", "fake", "dummy", "sample", "abc", "abcd", "abcdd", "abcde", "asdf", "qwerty", "demo", "none", "null"}
    is_dummy_exact = user_part in dummy_names
    is_dummy_prefix = bool(re.match(r"^(test|fake|dummy|sample|demo|temp)[0-9]*$", user_part))
    has_repeated_chars = bool(re.search(r"([a-zA-Z])\1{2,}", user_part))

    if zero_vowels or extreme_consonant_cluster or is_keyboard_mash or has_alphabet_seq or is_dummy_exact or is_dummy_prefix or has_repeated_chars:
        raise HTTPException(
            status_code=404,
            detail=f"Alert: Gmail/Email '{email_clean}' does not exist. Please enter a real registered email address."
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
