import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardActions,
  CardActionArea,
} from "@mui/material";
import classnames from "classnames";

import NoImage from "src/assets/No-Image-Placeholder.png";

import ActionButton from "../common/buttons/ActionButton";

import { useStyles } from "./style";
import CustomIcon from "../customIcon";
import { IconType } from "src/types/enums";

interface IProps {
  className?: string;
  data: Pick<Item, "_id" | "name" | "image" | "price">;
}

export const SimpleCard: React.FC<IProps> = ({ data, className }) => {
  const { _id, name, image, price } = data;
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Card variant="outlined" className={classnames(classes.root, className)}>
      <CardActionArea className={classes.content}>
        <CardMedia
          component="img"
          src={image || NoImage}
          alt="card image"
          className={classes.image}
        />

        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
            padding: "15px 0",
            textAlign: "start",
          }}
        >
          <Typography variant="h7" className={classes.title}>
            {name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", columnGap: "8px" }}>
            <Typography variant="h5">$ {price}</Typography>
          </Box>
        </CardContent>

        <CardActions
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ActionButton
            className={classes.detailsBtn}
            onClick={() => navigate(_id)}
            text={"Details"}
          />
          <CustomIcon
            type={IconType.basket}
            onClick={(e) => {
              console.log(e);
            }}
          />
        </CardActions>
      </CardActionArea>
    </Card>
  );
};