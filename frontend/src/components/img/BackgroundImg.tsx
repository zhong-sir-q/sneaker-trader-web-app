import styled from "styled-components";

export type BackgroundImgProps = {
  background: string;
  ratio?: string;
};

const BackgroundImg = styled.div<BackgroundImgProps>`
  background-image: url(${({ background }) => `"${background}"`});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  padding-bottom: ${({ ratio }) => ratio || '100%'};
`;

export default BackgroundImg
