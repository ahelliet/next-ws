import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";

export default function ServerComponent() {
  async function myServerAction(formData: FormData) {
    "use server";
    return await Sentry.withServerActionInstrumentation(
      "myServerAction", // The name you want to associate this Server Action with in Sentry
      {
        formData, // Optionally pass in the form data
        headers: headers(), // Optionally pass in headers
        recordResponse: true, // Optionally record the server action response
      },
      async () => {
        // ... Your Server Action code

        return { name: "John Doe" };
      },
    );
  }

  return (
    <form action={myServerAction}>
      <input type="text" name="some-input-value" />
      <button type="submit">Run Action</button>
    </form>
  );
}
