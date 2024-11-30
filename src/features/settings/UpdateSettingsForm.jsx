import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSettings } from "./hooks/useSettings";
import Spinner from "../../ui/Spinner";
import { useUpdateSetting } from "./hooks/useUpdateSetting";

function UpdateSettingsForm() {
  const { isFetching, settings = {} } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  function onUpdateSetting(e) {
    const fieldValue = +e.target.value;
    const fieldName = e.target.name;
    const defaultValue = +e.target.defaultValue;

    if (
      fieldValue <= 0 ||
      fieldValue === undefined ||
      fieldValue === null ||
      fieldValue === defaultValue ||
      !fieldName
    )
      return;

    updateSetting({ [`${fieldName}`]: fieldValue });
  }

  const isWorking = isUpdating || isFetching;

  if (isFetching) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          name="minBookingLength"
          id="min-nights"
          disabled={isWorking}
          defaultValue={settings?.minBookingLength}
          onBlur={onUpdateSetting}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          name="maxBookingLength"
          id="max-nights"
          disabled={isWorking}
          defaultValue={settings?.maxBookingLength}
          onBlur={onUpdateSetting}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          name="maxGuestsPerBooking"
          id="max-guests"
          disabled={isWorking}
          defaultValue={settings?.maxGuestsPerBooking}
          onBlur={onUpdateSetting}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          name="breakfastPrice"
          id="breakfast-price"
          disabled={isWorking}
          defaultValue={settings?.breakfastPrice}
          onBlur={onUpdateSetting}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
