import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./hooks/useCreateCabin";
import { useEditCabin } from "./hooks/useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { createCabin, isCreatingCabin } = useCreateCabin();
  const { editCabin, isEditingCabin } = useEditCabin();

  function onSubmit(data) {
    const image =
      data.image instanceof FileList && data.image.length > 0
        ? data.image[0]
        : data.image || "";

    if (isEditSession) {
      editCabin(
        {
          cabinData: {
            ...data,
            image,
          },
          id: editId,
          currentImageUrl: editValues?.image ?? "",
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createCabin(
        {
          ...data,
          image,
        },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  function onInvalid(errors) {
    console.log(errors);
  }

  return (
    <Form
      $type={onCloseModal ? "modal" : "regular"}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <FormRow error={errors?.name?.message} label="Cabin name">
        <Input
          type="text"
          id="name"
          disabled={isEditingCabin || isCreatingCabin}
          {...register("name", {
            required: "Cabin name is required",
          })}
        />
      </FormRow>
      <FormRow error={errors?.maxCapacity?.message} label="Maximum capacity">
        <Input
          type="text"
          id="maxCapacity"
          disabled={isEditingCabin || isCreatingCabin}
          {...register("maxCapacity", {
            required: "Maximum capacity is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>
      <FormRow error={errors?.regularPrice?.message} label="Regular price">
        <Input
          type="text"
          id="regularPrice"
          disabled={isEditingCabin || isCreatingCabin}
          {...register("regularPrice", {
            required: "Regular price is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>
      <FormRow error={errors?.discount?.message} label="Discount">
        <Input
          type="text"
          id="discount"
          disabled={isEditingCabin || isCreatingCabin}
          defaultValue={0}
          {...register("discount", {
            required: "Discount is required",
            validate(value, formValues) {
              return +value > +formValues.regularPrice
                ? "Discount should be less than regular price"
                : undefined;
            },
          })}
        />
      </FormRow>
      <FormRow
        error={errors?.description?.message}
        label="Description for website"
      >
        <Textarea
          type="number"
          id="description"
          disabled={isEditingCabin || isCreatingCabin}
          defaultValue=""
          {...register("description", {
            required: "Description is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isEditingCabin || isCreatingCabin}
          {...register("image", {
            required: isEditSession ? false : "Cabin image is required",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          $variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isEditingCabin || isCreatingCabin}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
