import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./hooks/useUser";
import { useUpdateUser } from "./hooks/useUpdateUser";
import SpinnerMini from "../../ui/SpinnerMini";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName, avatar: currentAvatarUrl },
    },
  } = useUser();
  const { isUpdatingUser, updateUser } = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;

    updateUser(
      { fullName, avatar, currentAvatarUrl },
      {
        onSuccess: () => {
          setAvatar(null);
          e.target.reset(); // resets the form
        },
      }
    );
  }

  function handleCancel() {
    setAvatar(null);
    setFullName(currentFullName);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isUpdatingUser}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          disabled={isUpdatingUser}
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          $variation="secondary"
          disabled={isUpdatingUser}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdatingUser}>
          {isUpdatingUser && <SpinnerMini />}
          <span>{isUpdatingUser ? "Updating..." : "Update account"}</span>
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
