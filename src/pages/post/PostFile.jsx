import { Stack, Typography } from "@mui/material";
import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const PostFile = ({ number, data }) => {
  return (
    <PhotoProvider>
      {number === 1 && (
        <Stack>
          <PhotoView src={data[0].url}>
            <img
              src={data[0].url}
              alt=""
              style={{
                maxHeight: "500px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </PhotoView>
        </Stack>
      )}

      {number === 2 && (
        <Stack direction="row" gap={2}>
          {data.slice(0, 2).map((item, index) => (
            <PhotoView key={index} src={item.url}>
              <img
                src={item.url}
                alt=""
                style={{ width: "48%", objectFit: "cover", cursor: "pointer" }}
              />
            </PhotoView>
          ))}
        </Stack>
      )}

      {number === 3 && (
        <Stack direction="row" gap={2}>
          <PhotoView src={data[0].url}>
            <img
              src={data[0].url}
              alt=""
              style={{ width: "60%", objectFit: "cover", cursor: "pointer" }}
            />
          </PhotoView>
          <Stack
            sx={{ width: "50%" }}
            direction="column"
            justifyContent="space-between"
            gap={2}
          >
            {[1, 2].map((i) => (
              <PhotoView key={i} src={data[i].url}>
                <img
                  src={data[i].url}
                  alt=""
                  style={{
                    width: "98%",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </PhotoView>
            ))}
          </Stack>
        </Stack>
      )}

      {number >= 4 && (
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            {[0, 1].map((i) => (
              <PhotoView key={i} src={data[i].url}>
                <img
                  src={data[i].url}
                  alt=""
                  style={{
                    width: "50%",
                    height: "250px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </PhotoView>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <PhotoView src={data[2].url}>
              <img
                src={data[2].url}
                alt=""
                style={{
                  width: "50%",
                  height: "250px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            </PhotoView>

            <PhotoView src={data[3].url}>
              <Stack
                sx={{
                  width: "50%",
                  height: "250px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <img
                  src={data[3].url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: number > 4 ? "brightness(50%)" : "none",
                  }}
                />
                {number > 4 && (
                  <Typography
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "white",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    +{number - 4}
                  </Typography>
                )}
              </Stack>
            </PhotoView>
          </Stack>

          {/* Hidden ảnh còn lại để gallery nhận */}
          {data.slice(4).map((item, index) => (
            <PhotoView key={`hidden-${index}`} src={item.url}>
              <img
                src={item.url}
                alt=""
                style={{ display: "none" }} // Ẩn ảnh nhưng vẫn vào gallery
              />
            </PhotoView>
          ))}
        </Stack>
      )}
    </PhotoProvider>
  );
};

export default PostFile;
