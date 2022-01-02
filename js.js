import React, { useState } from "react";
import { Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@material-ui/core";
import WarningSign from "../../assets/images/warning.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  dialog: {
    borderRadius: "40px !important",
    maxWidth: "400px !important"
  },
  title: {
    margin: "10px 0 0 0",
    fontSize: "40px",
    color: "#ff9800"
  },
  warningSignDiv: {
    height: "100px",
    width: "100px",
    margin: "0 auto 10px auto",
    border: "5px solid #ff9800",
    borderRadius: "125px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  warningImg: {
    height: "60px",
    width: "60px",
    objectFit: "contain"
  },
  warningMsg: {
    fontFamily: "calibri !important",
    color: "#000",
    margin: "0 0 10px 0",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    display: "inline-block"
  },
  button: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    width: "50%",
    "&:hover" : {
      backgroundColor: "#3f51b5",
      color: "#fff",
      width: "50%"
    }
  },
  imgName: {
    fontFamily: "calibri",
    color: "#000"
  },
  titleDiv: {
    color: "#3f51b5",
    fontWeight: "bold !important",
    fontSize: "20px !important",
    fontFamily: "calibri !important",
    textAlign: "center"
  },
  actions: {
    textAlign: "center",
    display: "inline-block !important",
    paddingBottom: "20px !important"
  }
});

const UploadImage = ({ handleUploadImages = () => {}, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duplicateImages, setDuplicateImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const classes = useStyles();

  const onUploadImage = (files) => {
    const fileList = Array.from(files);
    const images = fileList.map((image) => {
      let productCode = image?.productCode;
      let contentSlot = image?.slot;

      const matcher = /^(.*)_(.*)\./;

      if (!productCode || image?.productCode === "") {
        [, productCode = image?.name?.replace(/\.[^/.]+$/, "")] =
          matcher.exec(image?.name) ?? [];
      }

      if (!contentSlot || image?.slot === "") {
        [, , contentSlot = ""] = matcher.exec(image?.name) ?? [];
      }
      
      return {
        productCode,
        newProductCode: productCode,
        contentSlot,
        productName: "",
        imageFile: image,
        imageFileName: image?.name,
        imageUrl: null,
      }
    });

    const imageNames = images.map(img => (img.imageFileName));
    const existingImgNames = Object.values(products).filter((pvalue) => {
      const productImages = pvalue.productImages;
      if (productImages > 0) {
        let getArr = productImages.find(existedImages => imageNames.includes(existedImages.imageFileName));
        if(getArr) return getArr.imageFileName;
      }
    })
    setDuplicateImages(existingImgNames);

    const newFilteredImages = images.filter(newImg => !existingImgNames.includes(newImg.imageFileName));

    existingImgNames.length > 0 ? (setIsOpen(true), setNewImages(newFilteredImages)) : (handleUploadImages(images));
  };

  const handleDrop = (e) => {
    e.nativeEvent.preventDefault();
    if (!e) return;
    const files = e.nativeEvent.dataTransfer.files;
    onUploadImage(files);
  };

  const browseFiles = (e) => {
    if (!e) return;
    const files = e.currentTarget.files;
    onUploadImage(files);
    e.target.value = null;
  };

  return (
    <Grid container>
      <Dialog onClose={() => setIsOpen(false)} open={isOpen} 
      classes={{
        paper: classes.dialog
      }}>
        <DialogTitle className={classes.titleDiv}>
          <div className={classes.warningSignDiv}>
            <img src={WarningSign} alt="" className={classes.warningImg}/>
          </div>
          <p className={classes.title}>Warning</p>
        </DialogTitle>
        <DialogContent>
          <div id="alert-dialog-description">
          <span className={classes.warningMsg}>These images will not be uploaded cause they already exist.</span>
          <ol>
          {duplicateImages.length > 0 && duplicateImages.map((img,index) => {
           return <li key={index} className={classes.imgName}>{img}</li>
          })}
          </ol>
          </div>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={() => {
            setIsOpen(false); 
            handleUploadImages(newImages);
          }}
          className={classes.button}
          >OK</Button>
        </DialogActions>
      </Dialog>
      <Grid item xs={12} md={12}>
        <Paper>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e)}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                marginBottom: "1rem",
              }}
            >
              Drag & Drop Images here
            </h3>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                marginBottom: "1rem",
              }}
            >
              or
            </p>
            <Button
              size="medium"
              variant="outlined"
              component="label"
              color="primary"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => browseFiles(e)}
              />
              Browse files
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default UploadImage;
