import UpdateSettingsForm from "../features/settings/UpdateSettingsForm";
import Column from "../ui/Column";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Settings() {
  return (
    <>
      <Row>
        <Heading as="h1">Update hotel settings</Heading>
      </Row>
      <Column>
        <UpdateSettingsForm />
      </Column>
    </>
  );
}

export default Settings;
