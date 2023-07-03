/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";

import { Box, Button, Modal, Typography } from "@mui/material";
import { FormikValues } from "formik";

import { CustomInput, CustomSelect } from "src/components/common/inputs";

import { DRINK_CATEGORY, LOGIC_TYPE } from "src/utils/constants/constants";

import { useStyles } from "./style";
import { DropZone } from "src/containers/dropZone";
import { UploadButton } from "src/components/common/buttons/UploadButton";
import { ActionButton } from "src/components/common/buttons";
import { ImageCropper } from "src/components/ImageCropper";
import { useAppDispatch, useAppSelector } from "src/utils/hooks/redux";
import { upload } from "src/redux/services/fileService";
import { getItemById } from "src/redux/services/itemsService";
import { CircularLoader } from "src/components/loader";

interface IProps {
  isEdit?: string;
}

const AddItemPageView: React.FC<FormikValues & IProps> = ({
  values,
  handleChange,
  setFieldValue,
  handleSubmit,
  setValues,
  isEdit,
}) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { item, loading } = useAppSelector((state) => state.items);

  const [fileLoad, setFileLoad] = useState<any>();
  const [cropper, setCropper] = useState<Cropper>();
  const [image, setImage] = useState<string | undefined>(undefined);
  const [openModal, setOpenModal] = useState(false);

  const handleSubmitCrop = async () => {
    if (cropper) {
      const res: Response = await fetch(cropper.getCroppedCanvas().toDataURL(fileLoad?.type));
      const blob: Blob = await res.blob();
      if (fileLoad) {
        const file = new File([blob], fileLoad.name, { type: fileLoad.type }) as any;
        file.preview = fileLoad.preview;
        file.path = fileLoad.path;

        const formData = new FormData();
        formData.append("image", file);

        dispatch(
          upload({
            data: { name: "image", formData },
            func: (data: any) => {
              setImage(undefined);
              setOpenModal(false);
              setFieldValue("image", {
                _id: data.data._id,
                name: data.data.name,
                url: data.data.url,
              });
            },
          })
        );
      }
    }
  };

  const handleCloseModal = () => {
    setCropper(undefined);
    setImage(undefined);
    setOpenModal(false);
  };

  const handleImage = useCallback(
    (name: string, file: [any], index?: number) => {
      const reader = new FileReader();

      setFileLoad(file[0]);

      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file[0]);

      setOpenModal(true);
    },
    [values]
  );

  useEffect(() => {
    if (item.name) {
      setValues({
        _id: item._id,
        name: item.name,
        category: item.category,
        price: item.price,
        volume: item.volume,
        description: item.description,
        popular: item.popular,
        count: item.count,
        image: item.image,
      });
    }
  }, [item]);

  useEffect(() => {
    if (isEdit) {
      dispatch(getItemById(isEdit));
    }
  }, [isEdit]);

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.items}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "-webkit-fill-available",
              rowGap: "20px",
              maxWidth: "400px",
            }}
          >
            <CustomInput name="name" label="Name" onChange={handleChange} value={values.name} />
            <CustomInput
              name="description"
              label="Description"
              onChange={handleChange}
              value={values.description}
            />
          </Box>
          <Box sx={{ maxWidth: "320px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
            <CustomSelect
              name="category"
              label="Category"
              value={values.category}
              onChange={handleChange}
              data={DRINK_CATEGORY}
            />
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                rowGap: "20px",
              }}
            >
              <CustomInput
                name="price"
                type="number"
                label="Price"
                onChange={handleChange}
                value={values.price}
                className={classes.itemOption}
              />
              <CustomInput
                name="count"
                type="number"
                label="Count"
                onChange={handleChange}
                value={values.count}
                className={classes.itemOption}
              />
              <CustomInput
                name="volume"
                type="number"
                label="Volume"
                onChange={handleChange}
                value={values.volume}
                className={classes.itemOption}
              />
              <CustomSelect
                name="popular"
                label="Popular"
                value={values.popular}
                onChange={handleChange}
                data={LOGIC_TYPE}
                className={classes.itemOption}
                fullWidth={false}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ width: "400px", height: "500px" }}>
          <DropZone
            title="Select an image or drag and drop here"
            subtitle="PNG, JPG, file size no more than 10MB"
            btnText="Select an image"
            onChange={handleImage}
            image={values.image}
          />
          <Modal open={openModal} onClose={handleCloseModal} className={classes.cropModal}>
            <Box className={classes.cropModalContainer}>
              <Typography>Crop your image</Typography>
              <Box
                sx={{
                  position: "relative",
                  height: "100%",
                  width: "100%",
                }}
              >
                <ImageCropper image={image} setCropper={setCropper} />
              </Box>

              <Box className={classes.cropButtonContainer}>
                <ActionButton text="Cancel" variant="text" size="SM" onClick={handleCloseModal} />
                <Box className={classes.cropButtonGroup}>
                  <UploadButton text="Replace image" callBack={handleChange} variant="text" />
                  <ActionButton
                    text="Crop"
                    variant="contained"
                    size="SM"
                    onClick={handleSubmitCrop}
                  />
                </Box>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSubmit()}
        sx={{ margin: "20px" }}
      >
        Add
      </Button>
    </Box>
  );
};

export default AddItemPageView;
