import { useCallback, useId, useState } from "react";
import { z } from "zod";

import { authClient } from "#/auth/auth-client";

const emailSchema = z.string().trim().toLowerCase().email();
const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/);

export function AdminSignIn() {
  const emailId = useId();
  const otpId = useId();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.currentTarget.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setErrorMessage(null);

      const formData = new FormData(event.currentTarget);
      const parsedEmail = emailSchema.safeParse(email);

      if (!parsedEmail.success) {
        setErrorMessage("Saisis une adresse e-mail valide.");
        return;
      }

      setIsPending(true);

      try {
        if (step === "email") {
          const response = await authClient.emailOtp.sendVerificationOtp({
            email: parsedEmail.data,
            type: "sign-in",
          });

          if (response.error) {
            setErrorMessage("Impossible d’envoyer le code. Réessaie.");
            return;
          }

          setEmail(parsedEmail.data);
          setStep("otp");
          return;
        }

        const parsedOtp = otpSchema.safeParse(formData.get("otp"));

        if (!parsedOtp.success) {
          setErrorMessage("Saisis le code à 6 chiffres reçu par e-mail.");
          return;
        }

        const response = await authClient.signIn.emailOtp({
          email: parsedEmail.data,
          otp: parsedOtp.data,
        });

        if (response.error) {
          setErrorMessage("Ce code est invalide ou expiré.");
        }
      } catch (error) {
        if (!(error instanceof Error)) {
          throw error;
        }

        setErrorMessage("La connexion a échoué. Réessaie.");
      } finally {
        setIsPending(false);
      }
    },
    [email, step],
  );

  return (
    <main className="access-page">
      <section className="access-card">
        <p className="access-eyebrow">My Beach App</p>
        <h1>Connexion au back-office</h1>
        <p>Utilise l’adresse e-mail de ton compte admin.</p>

        <form className="access-form" onSubmit={handleSubmit}>
          <label htmlFor={emailId}>Adresse e-mail</label>
          <input
            autoComplete="email"
            disabled={step === "otp"}
            id={emailId}
            name="email"
            onChange={handleEmailChange}
            required
            type="email"
            value={email}
          />

          {step === "otp" ? (
            <>
              <label htmlFor={otpId}>Code de connexion</label>
              <input
                autoComplete="one-time-code"
                id={otpId}
                inputMode="numeric"
                maxLength={6}
                name="otp"
                pattern="[0-9]{6}"
                required
              />
            </>
          ) : null}

          {errorMessage ? (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button className="primary-button" disabled={isPending} type="submit">
            {isPending
              ? "Connexion en cours…"
              : step === "email"
                ? "Recevoir un code"
                : "Se connecter"}
          </button>
        </form>
      </section>
    </main>
  );
}
