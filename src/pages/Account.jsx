import Heading from "../ui/Heading";
import Column from "../ui/Column";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";

function Account() {
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Column>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Column>

      <Column>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </Column>
    </>
  );
}

export default Account;
