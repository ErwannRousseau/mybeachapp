import { AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS } from "@mybeachapp/shared/auth/constants";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "react-email";

export type AuthEmailOtpTemplateProps = {
  otp: string;
};

const expirationMinutes = AUTH_EMAIL_OTP_EXPIRES_IN_SECONDS / 60;

const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        beachBackground: "#F7F7FA",
        beachBorder: "#D2D4E4",
        beachCoral: "#FF6B4A",
        beachForeground: "#0E0D34",
        beachMuted: "#5B5ABE",
        beachSurface: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
};

export function AuthEmailOtpTemplate({ otp }: AuthEmailOtpTemplateProps) {
  return (
    <Html dir="ltr" lang="fr">
      <Tailwind config={tailwindConfig}>
        <Head />
        <Body className="m-0 bg-beachBackground px-0 py-8 font-sans">
          <Preview>
            {`Ton code My Beach App expire dans ${expirationMinutes} minutes.`}
          </Preview>
          <Container className="mx-auto my-0 max-w-[420px] overflow-hidden rounded-[24px] border border-beachBorder border-solid bg-beachSurface px-0 py-0 shadow-[0_18px_60px_rgba(14,13,52,0.12)]">
            <Section className="px-8 pt-9 pb-6 text-center">
              <Text className="m-0 font-bold text-[11px] text-beachCoral uppercase leading-4 tracking-[2px]">
                My Beach App
              </Text>
              <Heading
                as="h1"
                className="mx-0 mt-4 mb-0 text-center font-bold text-[24px] text-beachForeground leading-[31px]"
              >
                Entre ce code pour continuer.
              </Heading>
              <Text className="mx-0 mt-4 mb-0 text-center text-[16px] text-beachMuted leading-6">
                On a reçu une demande de connexion avec ton email.
              </Text>
            </Section>

            <Section className="mx-auto mt-0 mb-7 w-[300px] rounded-[20px] border border-beachBorder border-solid bg-[#F4F4F8]">
              <Text className="mx-auto my-0 px-0 py-4 text-center font-bold text-[34px] text-beachForeground leading-[42px] tracking-[8px]">
                {otp}
              </Text>
            </Section>

            <Section className="px-8 pb-9 text-center">
              <Text className="mx-0 mt-0 mb-2 text-center text-[15px] text-beachForeground leading-[23px]">
                Ce code expire dans {expirationMinutes} minutes.
              </Text>
              <Text className="m-0 text-center text-[14px] text-beachMuted leading-[22px]">
                Si tu n'as pas demandé ce code, ignore cet email.
              </Text>
            </Section>
          </Container>
          <Text className="mx-0 mt-5 mb-0 text-center font-bold text-[12px] text-beachForeground uppercase leading-[20px] tracking-[1px]">
            My Beach App
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

AuthEmailOtpTemplate.PreviewProps = {
  otp: "144833",
} satisfies AuthEmailOtpTemplateProps;
