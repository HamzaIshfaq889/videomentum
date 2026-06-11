import { MigrationHero } from "@/components/migration/MigrationHero";
import { MigrationSteps } from "@/components/migration/Migrationsteps";
import { PainPoints } from "@/components/migration/PainPoints";
import { SignUpForm } from "@/components/migration/Signupform";
import { WhyVideomentum } from "@/components/migration/Whyvideomentum";

export default function MigratePage() {
  return (
    <main>
      <MigrationHero />
      <PainPoints />
      <WhyVideomentum />
      <MigrationSteps />
      <SignUpForm />
    </main>
  );
}
